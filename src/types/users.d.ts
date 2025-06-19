import type { UUID } from "node:crypto";

export type defaultProfileType = "DEFAULT";
export type sellerProfileType = "SELLER";
export type adminProfileType = "ADMIN";

export type IUserProfileType =
    | defaultProfileType
    | sellerProfileType
    | adminProfileType;

export interface Iuser {
    id: number;
    uid: UUID;
    fullname: string;
    email: string;
    role: IUserProfileType;
    password?: string;
    phone_number?: string;
    address?: Array<string> | string | undefined;
}

export interface OtpErrorMessages {
    language: string;
    otp_Lock_message: string;
    otp_Spam_message: string;
    otp_Cooldown_message: string;
    otp_Attempts_message: string;
    otp_Invalid_message: string;
}

export interface OtpVerifyOptions {
    fullname: string;
    email: string;
    password: string;
    role?: IUserProfileType;
    otp: string;
}

export interface ILoginOptions {
    email: string;
    password: string;
    rememberme?: boolean;
}
export interface IUserEmailOptions {
    email: string;
}
export interface IUserResetPasswordOptions {
    email: string;
    newPassword: string;
}

export interface IUserVerifyOtp {
    email: string;
    otp: string;
}
