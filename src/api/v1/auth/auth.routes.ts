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
    url: "/reset-password",
    handler: usersController.resetForgetPassword,
    errorHandler: errHandler.errResetForgetPassword,
    // schema: resetPasswordSchema,
};

const authRoutes = [
    signUpRoute,
    verifyAndCreateRoute,
    signInRoute,
    forgetPasswordRoute,
    verifyForgetPasswordOtpRoute,
    resetPasswordRoute
];

export default authRoutes;
