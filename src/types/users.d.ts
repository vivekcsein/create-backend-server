export type defaultProfileType = "DEFAULT";
export type sellerProfileType = "SELLER";
export type adminProfileType = "ADMIN";

export type IUserProfileType =
    | defaultProfileType
    | sellerProfileType
    | adminProfileType;

export interface Iuser {
    id: number;
    name: string;
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
    email: string;
    otp: string;
    password: string;
    name: string;
}

export interface ILoginOptions {
    email: string;
    password: string;
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
