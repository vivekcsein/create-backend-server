// all kind of functions will be stored here

import { OtpErrorMessagesList } from "./config.constants";
import type { OtpErrorMessages } from "../../types/users";

export const errOtpMessages: OtpErrorMessages | undefined =
  OtpErrorMessagesList.find((otp) => otp.language === "en");

export const OtpGenerator = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
