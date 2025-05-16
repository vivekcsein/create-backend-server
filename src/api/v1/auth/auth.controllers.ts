import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import type { FastifyRequest, FastifyReply } from "fastify";
import { envJWTServices } from "../../../configs/constants/config.env";
import UserModel from "../../../configs/models/model.users";
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
            await sendOtp(data.name, data.email, "email-otp-activation");
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
        const { email, otp, password, name } = req.body as OtpVerifyOptions;
        const defaultUserProfile: IUserProfileType = "DEFAULT";

        if (!email || !otp || !password || !name) {
            throw new ValidationError("All fields are required");
        }

        const userExits = await userExistsStatus(email);
        if (userExits) {
            throw new ValidationError(`Email already exists: ${email}`);
        }

        // await VerifyOtp(email, otp);

        const hasedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            name: name,
            email: email,
            password: hasedPassword,
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

        const User = await UserModel.findOne({ where: { email } });
        if (!User) {
            throw new ValidationError(`User doesn't exists: ${email}`);
        }
        const checkOtpStatus = await checkOtpRestrictions(email);
        const name = User?.dataValues.name;
        if (checkOtpStatus === true) {
            await trackOtpRequests(email);
            await sendOtp(name, email, "email-otp-forget-password");
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

        const User = await UserModel.findOne({ where: { email } });
        if (!User) {
            throw new ValidationError(`User doesn't exists: ${email}`);
        }

        const isSamePassword = await bcrypt.compare(newPassword, User?.dataValues.password!);

        if (isSamePassword) {
            throw new ValidationError("new password can not be same");
        }

        //update the new password
        const hasedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(
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

        const User = await UserModel.findOne({ where: { email: email } });
        if (!User) {
            throw new AuthError(`User doesn't exists`);
        }
        const UserInfo = {
            id: User?.dataValues?.id,
            password: User?.dataValues?.password,
            email: User?.dataValues?.email,
            name: User?.dataValues?.name,
            role: User?.dataValues?.role,
        };

        //verify password
        const isMatch = await bcrypt.compare(
            password,
            UserInfo.password ? UserInfo.password : ""
        );
        if (!isMatch) {
            throw new AuthError("Incorrect Password");
        }

        const accessToken = JWT.sign(
            {
                id: UserInfo.id,
                role: "DEFAULT",
            },
            envJWTServices.JWT_ACCESS_TOKEN,
            {
                expiresIn: `${rememberme ? "7d" : "1d"}`,
            }
        );

        const refreshToken = JWT.sign(
            {
                id: UserInfo.id,
                role: "DEFAULT",
            },
            envJWTServices.JWT_REFRESH_TOKEN,
            {
                expiresIn: `${rememberme ? "30d" : "7d"}`,
            }
        );

        // Only set refresh token cookie if HTTPS is used
        const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";

        setCookie(reply, "access_token", accessToken);

        if (isSecure) {
            setCookie(reply, "refresh_token", refreshToken);
        }

        reply
            .status(201)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: "user login succesfully",
                user: {
                    id: UserInfo.id,
                    email: UserInfo.email,
                    name: UserInfo.name,
                    role: UserInfo.role,
                },
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
        const refreshToken = req.cookies.REFRESH_TOKEN;

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
        console.error('Error verifying refresh token:', error);
        return reply.status(500)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                message: 'Internal server error'
            });
    }
};