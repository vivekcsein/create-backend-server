import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import type { FastifyRequest, FastifyReply } from "fastify";
import { envJWTServices } from "../../../configs/constants/config.env";
import LocalUserModel from "../../../configs/models/model.LocalUsers";

import {
    AuthError,
    ValidationError,
} from "../../../configs/utils/errors/errors.handler";
import { setCookie } from "../../../configs/utils/cookies/cookie.helper";
import {
    checkOtpRestrictions,
    sendOtp,
    trackOtpRequests,
    userExistsStatus,
    validateRegistration,
    VerifyOtp,
} from "./auth.helper";
import type {
    ILoginOptions,
    Iuser,
    IUserEmailOptions,
    IUserProfileType,
    IUserResetPasswordOptions,
    IUserVerifyOtp,
    OtpVerifyOptions,
} from "../../../types/users";

export const userSignUp = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const defaultUserProfile: IUserProfileType = "DEFAULT";
        const data = req.body as Iuser;
        validateRegistration(data, defaultUserProfile);

        // Check if email already exists before creating a new user
        const userExits = await userExistsStatus(data.email);
        if (userExits) {
            throw new ValidationError(`Email already exists: ${data.email}`);
        }
        const checkOtpStatus = await checkOtpRestrictions(data.email);
        if (checkOtpStatus === true) {
            await trackOtpRequests(data.email);
            await sendOtp(data.fullname, data.email, "email-otp-activation");
            reply
                .status(200)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    message: "Otp send to provided email, pls verify",
                });
        }
    } catch (error) {
        return error;
    }
};

export const userVerifyandCreateUser = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const { email, otp, password, fullname } = req.body as OtpVerifyOptions;
        const defaultUserProfile: IUserProfileType = "DEFAULT";

        if (!email || !password || !fullname || !otp) {
            throw new ValidationError("All fields are required");
        }

        const userExits = await userExistsStatus(email);
        if (userExits) {
            throw new ValidationError(`Email already exists: ${email}`);
        }

        // await VerifyOtp(email, otp);

        const hasedPassword = await bcrypt.hash(password, 10);
        const newUser = await LocalUserModel.create({
            uid: crypto.randomUUID(),
            email: email,
            password: hasedPassword,
            fullname: fullname,
            role: defaultUserProfile,
        });

        reply
            .status(201)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: `New user is created with id:${newUser.dataValues.id}`,
            });
    } catch (error) {
        return error;
    }
};

export const userForgetPassword = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const { email } = req.body as IUserEmailOptions;
        if (!email) {
            throw new ValidationError("Email is required!!!");
        }

        const User = await LocalUserModel.findOne({ where: { email } });
        if (!User) {
            throw new ValidationError(`User doesn't exists: ${email}`);
        }
        const checkOtpStatus = await checkOtpRestrictions(email);
        const fullname = User?.dataValues.fullname;
        if (checkOtpStatus === true) {
            await trackOtpRequests(email);
            await sendOtp(fullname, email, "email-otp-forget-password");
            reply
                .status(200)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    message: "Otp send to provided email, pls verify",
                });
        }
    } catch (error) {
        return error;
    }
};

export const VerifyForgetPasswordOtp = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {

    try {
        const { email, otp } = req.body as IUserVerifyOtp;
        if (!email || !otp) {
            throw new ValidationError("All fields are required");
        }

        await VerifyOtp(email, otp);
        reply
            .status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: "Otp is verified, you can reset your password",
            });
    } catch (error) {

    }
}

export const resetForgetPassword = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const { email, newPassword } = req.body as IUserResetPasswordOptions;
        if (!email || !newPassword) {
            throw new ValidationError("Email &  new Password are required!!!");
        }

        const User = await LocalUserModel.findOne({ where: { email } });
        if (!User) {
            throw new ValidationError(`User doesn't exists: ${email}`);
        }

        const isSamePassword = await bcrypt.compare(newPassword, User?.dataValues.password!);

        if (isSamePassword) {
            throw new ValidationError("new password can not be same");
        }

        //update the new password
        const hasedPassword = await bcrypt.hash(newPassword, 10);
        await LocalUserModel.update(
            {
                password: hasedPassword
            },
            {
                where: {
                    email: email,
                },
            },
        );
        reply
            .status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: "password reset succesfully",
            });
    } catch (error) {
        return error;
    }
};


export const userSignIn = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password, rememberme } = req.body as ILoginOptions;

        if (!email || !password) {
            throw new ValidationError("Email & password are required");
        }

        const User = await LocalUserModel.findOne({ where: { email: email } });
        if (!User) {
            throw new AuthError(`User doesn't exists`);
        }
        const savedUserPassword = User?.dataValues?.password;
        const UserInfo = {
            id: User?.dataValues?.id,
            email: User?.dataValues?.email,
            fullname: User?.dataValues?.fullname,
            role: User?.dataValues?.role,
        };

        if (!savedUserPassword) {
            throw new AuthError("Try login with other methods");
        }

        //verify password
        const isMatch = await bcrypt.compare(password, savedUserPassword);

        if (!isMatch) {
            throw new AuthError("Incorrect Password");
        }

        const accessToken = JWT.sign(
            {
                id: UserInfo.id,
            },
            envJWTServices.JWT_ACCESS_TOKEN,
            {
                expiresIn: `${rememberme ? "60m" : "15m"}`,
            }
        );

        const refreshToken = JWT.sign(
            {
                id: UserInfo.id,
            },
            envJWTServices.JWT_REFRESH_TOKEN,
            {
                expiresIn: `${rememberme ? "30d" : "7d"}`,
            }
        );

        // Only set refresh token cookie if HTTPS is used
        // const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";

        setCookie(reply, "access_token", accessToken, { secure: true });
        setCookie(reply, "refresh_token", refreshToken, { secure: true });

        // if (isSecure) {
        // }

        reply
            .status(201)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: "user login succesfully",
                user: UserInfo
            });
    } catch (error) {
        return error;
    }
};


// Middleware to verify access token from HttpOnly cookie
export const verifyAccessToken = async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
    if (!token) {
        throw new AuthError("Authentication required");
    }
    try {
        const decoded = JWT.verify(token, envJWTServices.JWT_ACCESS_TOKEN);
        (req as any).user = decoded;

        // Token is valid, send the decoded payload
        reply.status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: 'Token verified successfully', data: decoded
            });
    } catch (err) {
        throw new AuthError("Invalid or expired access token");
    }
};


export const verifyRefreshToken = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            throw new ValidationError("'Refresh token is required'", [])
        }

        // Verify the refresh token
        JWT.verify(refreshToken, envJWTServices.JWT_REFRESH_TOKEN, (err: any, decoded: any) => {
            if (err) {
                return reply.status(401)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send({
                        message: 'Invalid or expired refresh token',
                    });
            }

            // Token is valid, send the decoded payload
            return reply.status(200)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    message: 'Token verified successfully', data: decoded
                });

        });
    } catch (error) {
        // console.error('Error verifying refresh token:', error);
        reply.status(500)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: 'Internal server error'
            });
    }
};

// Helper to fetch user info by id
const fetchUser = async (userId: number) => {
    const User = await LocalUserModel.findByPk(userId, {
        attributes: ["id", "email", "fullname", "role"]
    });

    if (!User) return null;

    const UserInfo = {
        id: User?.dataValues?.id,
        email: User?.dataValues?.email,
        fullname: User?.dataValues?.fullname,
        role: User?.dataValues?.role,
    };
    return UserInfo;
}

// Verify access and refresh tokens, then fetch user info
export const verifyTokensAndFetchUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;

        if (!accessToken) {
            return reply.status(401)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({ message: "Access tokens is required" });
        }

        if (!refreshToken) {
            return reply.status(401)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({ message: "Refresh tokens are required" });
        }

        let decodedAccess;
        let decodedRefresh;
        try {
            decodedAccess = JWT.verify(accessToken, envJWTServices.JWT_ACCESS_TOKEN);
        } catch {
            return reply.status(401)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({ message: "Invalid or expired access token" });
        }

        try {
            decodedRefresh = JWT.verify(refreshToken, envJWTServices.JWT_REFRESH_TOKEN);
        } catch {
            return reply.status(401)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({ message: "Invalid or expired refresh token" });
        }

        // Both tokens are valid, fetch user info
        const fetchedUser = await fetchUser((decodedAccess as any).id as number);
        if (!fetchedUser) {
            return reply.status(404)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({ message: "User not found" });
        }

        return reply.status(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ success: true, user: fetchedUser });
    } catch (error) {
        return reply.status(500)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ message: "Internal server error" });
    }
};

export const userSignOut = async (_req: FastifyRequest, reply: FastifyReply) => {
    reply
        .clearCookie("access_token", { path: "/" })
        .clearCookie("refresh_token", { path: "/" })
        .send({ message: "Logged out" });
}