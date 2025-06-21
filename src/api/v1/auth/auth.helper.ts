import redis from "../../../configs/database/db.redis";
import LocalUserModel from "../../../configs/models/model.LocalUsers";
import type { Iuser, IUserProfileType } from "../../../types/users";

import {
  errOtpMessages,
  OtpGenerator,
} from "../../../configs/constants/config.helper";
import {
  OtpError,
  ValidationError,
} from "../../../configs/utils/errors/errors.handler";
import {
  sendEmail,
  type sendEmail_params,
} from "../../../configs/utils/emails/emails.helper";

export const validateRegistration = (
  data: Iuser,
  userProfileType: IUserProfileType
) => {
  const { fullname, email, password, phone_number } = data;
  if (
    !fullname ||
    !email ||
    !password ||
    (userProfileType === "SELLER" && !phone_number)
  ) {
    throw new ValidationError(`missing required fields`);
  }
};

export const userExistsInDB = async (email: string): Promise<boolean> => {
  // Check if user already exists in the database
  const existingUser = await LocalUserModel.findOne({ where: { email } });

  // Store user existence status in Redis with a 5-minute expiration
  if (existingUser) {
    await redis.set(`user_exits:${email}`, "true", { ex: 300 });
    return true;
  } else {
    await redis.set(`user_exits:${email}`, "false", { ex: 300 });
    return false;
  }
};

export const userExistsStatus = async (email: string): Promise<boolean> => {
  // Check if user existence status is cached in Redis
  const isCachedUser = Boolean(
    (await redis.get(`user_exits:${email}`)) as string
  );

  if (isCachedUser) {
    return true;
  } else {
    const User = await userExistsInDB(email);
    // If not cached, verify directly from the database
    return User;
  }
};

export const checkOtpRestrictions = async (email: string) => {
  const errOtpMessage = errOtpMessages;

  const resLockOtp = Boolean((await redis.get(`otp_lock:${email}`)) as string);
  if (resLockOtp) {
    throw new ValidationError(errOtpMessage?.otp_Lock_message);
  }
  const resSpamLockOtp = Boolean(
    (await redis.get(`otp_spam_lock:${email}`)) as string
  );
  if (resSpamLockOtp) {
    throw new ValidationError(errOtpMessage?.otp_Spam_message);
  }
  const resCooldownOtp = Boolean(
    (await redis.get(`otp_cooldown:${email}`)) as string
  );
  if (resCooldownOtp) {
    throw new ValidationError(errOtpMessage?.otp_Cooldown_message);
  } else {
    return true;
  }
};

export const trackOtpRequests = async (email: string) => {
  const errOtpMessage = errOtpMessages;

  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "true", { ex: 3600 }); // Lock for 1hour return
    return new ValidationError(errOtpMessage?.otp_Cooldown_message);
  }
  await redis.set(otpRequestKey, otpRequests + 1, { ex: 3600 });
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  //create Otp
  const OTP = OtpGenerator(100000, 999999).toString();

  // set the otp on redis database with expiry date
  const otpExpiryTime = 300;
  const otpNextTimetoSend = 300;
  const emailInfo: sendEmail_params = {
    to: email,
    subject: "Verify your email",
    templateName: template,
    data: { name: name, otp: OTP },
  };
  await sendEmail(emailInfo);
  await redis.set(`otp:${email}`, OTP, { ex: otpExpiryTime });
  await redis.set(`otp_cooldown:${email}`, "true", { ex: otpNextTimetoSend });
};

export const VerifyOtp = async (email: string, otp: string) => {
  const errOtpMessage = errOtpMessages;
  const storedOtp = (await redis.get(`otp:${email}`)) as string;

  if (!storedOtp) {
    throw new OtpError(errOtpMessage?.otp_Invalid_message);
  }

  const failedAttempsKey = `otp_attemp_key:${email}`;
  const failedAttemps = parseInt((await redis.get(failedAttempsKey)) || "0");

  if (parseInt(storedOtp, 10) !== parseInt(otp, 10)) {
    if (failedAttemps >= 2) {
      await redis.set(`otp_lock:${email}`, "true", { ex: 1800 });
      await redis.del(`otp:${email}`, failedAttempsKey);
      throw new ValidationError(errOtpMessage?.otp_Attempts_message);
    }
    await redis.set(failedAttempsKey, failedAttemps + 1, { ex: 300 });
    throw new ValidationError(
      `Incorrect Otp. ${2 - failedAttemps} attempts left`
    );
  }
  await redis.del(`otp:${email}`, failedAttempsKey);
};
