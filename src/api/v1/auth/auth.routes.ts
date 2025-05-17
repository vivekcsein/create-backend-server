import type { RouteOptions } from "fastify";
import * as usersController from "./auth.controllers";
import * as errHandler from "./auth.errorhandlers";

const signUpRoute: RouteOptions = {
    method: "POST",
    url: "/signup",
    handler: usersController.userSignUp,
    errorHandler: errHandler.errUserSignUp,
    // schema: signUpSchema,
};

const verifyAndCreateRoute: RouteOptions = {
    method: "POST",
    url: "/createuser",
    handler: usersController.userVerifyandCreateUser,
    errorHandler: errHandler.errUserVerifyandCreateUser,
    // schema: verifyAndCreateSchema,
};

const signInRoute: RouteOptions = {
    method: "POST",
    url: "/signin",
    handler: usersController.userSignIn,
    errorHandler: errHandler.errUserSignIn,
    // schema: signInSchema,
};

const verifyAccessTokenRoute: RouteOptions = {
    method: "POST",
    url: "/verify-user-access-token",
    handler: usersController.verifyAccessToken,
    errorHandler: errHandler.errVerifyAccessTokenRoute,
    // schema: verifyRefreshTokenSchema,
};

const verifyRefreshTokenRoute: RouteOptions = {
    method: "POST",
    url: "/verify-user-refresh-token",
    handler: usersController.verifyRefreshToken,
    errorHandler: errHandler.errVerifyRefreshTokenRoute,
    // schema: verifyRefreshTokenSchema,
};

const forgetPasswordRoute: RouteOptions = {
    method: "PUT",
    url: "/forget-password",
    handler: usersController.userForgetPassword,
    errorHandler: errHandler.errUserForgetPassword,
    // schema: forgetPasswordSchema,
};

const verifyForgetPasswordOtpRoute: RouteOptions = {
    method: "PUT",
    url: "/verify-reset-password-otp",
    handler: usersController.userForgetPassword,
    errorHandler: errHandler.errUserForgetPassword,
    // schema: verifyForgetPasswordOtpSchema,
};

const resetPasswordRoute: RouteOptions = {
    method: "PUT",
    url: "/update-password",
    handler: usersController.resetForgetPassword,
    errorHandler: errHandler.errResetForgetPassword,
    // schema: resetPasswordSchema,
};

const authRoutes = [
    signUpRoute,
    verifyAndCreateRoute,
    signInRoute,
    verifyAccessTokenRoute,
    verifyRefreshTokenRoute,
    forgetPasswordRoute,
    verifyForgetPasswordOtpRoute,
    resetPasswordRoute
];

export default authRoutes;
