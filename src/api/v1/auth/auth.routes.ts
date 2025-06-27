import type { RouteOptions } from "fastify";
import * as usersController from "./auth.controllers";
import * as errHandler from "./auth.errorhandlers";
import { UserCallbackFromGoogle, UserRedirectToGoogleSignin } from "../../../configs/auth/auth.google";

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

const fetchUser: RouteOptions = {
    method: "GET",
    url: "/fetch-user",
    handler: usersController.verifyTokensAndFetchUser,
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

const signOutRoute: RouteOptions = {
    method: "POST",
    url: "/signout",
    handler: usersController.userSignOut,
    errorHandler: errHandler.errUserSignIn,
    // schema: signInSchema,
};
const redirectToGoogleSignin: RouteOptions = {
    method: "GET",
    url: "/google",
    handler: UserRedirectToGoogleSignin,
    errorHandler: errHandler.errUserSignIn,
    // schema: signInWithGoogleSchema,
};

const callbackFromGoogle: RouteOptions = {
    method: "GET",
    url: "/google/callback",
    handler: UserCallbackFromGoogle,
    errorHandler: errHandler.errUserSignIn,
    // schema: signInWithGoogleSchema,
};

const signOutFromGoogle: RouteOptions = {
    method: "POST",
    url: "/signoutgoogle",
    handler: usersController.userSignOut,
    errorHandler: errHandler.errUserSignIn,
    // schema: signOutFromGoogleSchema,
};

const authRoutes = [
    signUpRoute,
    verifyAndCreateRoute,
    signInRoute,
    signOutRoute,
    verifyAccessTokenRoute,
    verifyRefreshTokenRoute,
    fetchUser,
    forgetPasswordRoute,
    verifyForgetPasswordOtpRoute,
    resetPasswordRoute,
    redirectToGoogleSignin,
    callbackFromGoogle,
    signOutFromGoogle,
];

export default authRoutes;
