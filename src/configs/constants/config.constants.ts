import type { IUserProfileType, OtpErrorMessages } from "../../types/users";

export const emailEndsWith = [
  "@gmail.com",
  "@hotmail.com",
  "@outlook.com",
  "@frenzz.com",
];

export const IuserAllowedRoles: Array<IUserProfileType> = [
  "DEFAULT",
  "SELLER",
  "ADMIN",
];

export const OtpErrorMessagesList: Array<OtpErrorMessages> = [
  {
    language: "en",
    otp_Lock_message:
      "Account is locked due to multiple failed attemps, try again later",
    otp_Spam_message: "Too many otp requests! Please wait for cooldown is over",
    otp_Cooldown_message: "Please wait for some untill cooldown will be over",
    otp_Attempts_message:
      "Too Many attempts. Your account is locked for 30 mins",
    otp_Invalid_message: "Invalid or Expired Otp entered",
  },
];
