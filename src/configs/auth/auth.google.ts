
import * as arctic from "arctic";
import { envGoogleClient, envJWTServices } from "../constants/config.env";
import type { FastifyReply, FastifyRequest } from "fastify";
import LocalUserModel from "../models/model.LocalUsers";
import SocialUserModel from "../models/model.SocialUsers";
// import { setCookie } from "../utils/cookies/cookie.helper";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const clientId = envGoogleClient.GOOGLE_CLIENT_ID;
const clientSecret = envGoogleClient.GOOGLE_CLIENT_SECRET;
const redirectURI = envGoogleClient.GOOGLE_REDIRECT_URL;

export const google = new arctic.Google(clientId, clientSecret, redirectURI);

// --- Google Sign-In Redirect Handler ---
export const UserRedirectToGoogleSignin = async (_req: FastifyRequest, reply: FastifyReply) => {
    const googleState = arctic.generateState();
    const googleCodeVerifier = arctic.generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];
    const googleAuthorizationURL = google.createAuthorizationURL(googleState, googleCodeVerifier, scopes);

    // Set cookies for PKCE and state
    reply
        .setCookie("google_oauth_state", googleState, {
            path: "/",
            httpOnly: true,
            secure: true,
            // secure: process.env.NODE_ENV === "production", // true in prod, false in dev
            sameSite: "none",
            maxAge: 10 * 60, // 10 minutes
        })
        .setCookie("google_oauth_verifier", googleCodeVerifier, {
            path: "/",
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60,
        });

    // Redirect directly to Google
    return reply.redirect(googleAuthorizationURL.toString(), 302);
};

// --- Google OAuth Callback Handler ---
export const UserCallbackFromGoogle = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        // Get cookies
        const storedState = req.cookies?.google_oauth_state;
        const codeVerifier = req.cookies?.google_oauth_verifier;

        if (!storedState || !codeVerifier) {
            return reply.status(400).send({ message: "Missing OAuth state or code verifier" });
        }

        // Get code and state from query
        const { code, state } = req.query as { code?: string; state?: string };
        if (!code || !state) {
            return reply.status(400).send({ message: "Missing code or state" });
        }

        // Validate state
        if (state !== storedState) {
            return reply.status(400).send({ message: "Invalid state" });
        }

        // Exchange code for tokens
        let tokens: arctic.OAuth2Tokens;
        try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
        } catch {
            return reply.status(401).send({ message: "Failed to exchange code for tokens" });
        }

        // Decode ID token to get user info
        let googleUser;
        try {
            googleUser = arctic.decodeIdToken(tokens.idToken());
        } catch {
            return reply.status(401).send({ message: "Failed to fetch user info from Google" });
        }

        // Extract user info (adjust property names as needed)
        const {
            sub: googleUserId,
            name: googleName,
            picture: googleProfileImage,
            email: googleUserEmail
        } = googleUser as { sub: string, name: string, picture: string, email: string };

        // Find or create user in your DB
        let user = await LocalUserModel.findOne({ where: { email: googleUserEmail } });
        let userId;
        if (!user) {
            const newUser = await SocialUserModel.create({
                uid: crypto.randomUUID(),
                email: googleUserEmail,
                name: googleName,
                provider: "google",
                providerId: googleUserId,
                image: googleProfileImage,
                role: "DEFAULT",
            });
            userId = newUser.dataValues.id;
        } else {
            userId = user.dataValues.id;
        }

        // Generate JWT tokens
        const accessToken = JWT.sign(
            { id: userId },
            envJWTServices.JWT_ACCESS_TOKEN,
            { expiresIn: "15m" }
        );
        const refreshToken = JWT.sign(
            { id: userId },
            envJWTServices.JWT_REFRESH_TOKEN,
            { expiresIn: "7d" }
        );

        // Set JWT cookies
        // setCookie(reply, "access_token", accessToken, {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/"
        // });
        // setCookie(reply, "refresh_token", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "lax",
        //     path: "/"
        // });

        // Redirect to frontend dashboard
        return reply.redirect("http://localhost:3000/dashboard");
    } catch (error) {
        return reply.status(500).send({ message: "Internal server error" });
    }
};

// import * as arctic from "arctic";
// import { envGoogleClient, envJWTServices } from "../constants/config.env";
// import type { FastifyReply, FastifyRequest } from "fastify";
// import LocalUserModel from "../models/model.LocalUsers";
// import SocialUserModel from "../models/model.SocialUsers";
// import { setCookie } from "../utils/cookies/cookie.helper";
// import JWT from "jsonwebtoken";

// const clientId = envGoogleClient.GOOGLE_CLIENT_ID;
// const clientSecret = envGoogleClient.GOOGLE_CLIENT_SECRET;
// const redirectURI = envGoogleClient.GOOGLE_REDIRECT_URL;

// export const google = new arctic.Google(clientId, clientSecret, redirectURI);



// export const UserRedirectToGoogleSignin = async (req: FastifyRequest, reply: FastifyReply) => {

//     const googleState = arctic.generateState();
//     const googleCodeVerifier = arctic.generateCodeVerifier();
//     const scopes = ["openid", "profile", "email"];
//     const googleAuthorizationURL = google.createAuthorizationURL(googleState, googleCodeVerifier, scopes);

//     reply
//         .status(302)
//         .setCookie("google_oauth_state", googleState, {
//             path: "/google/callback",
//             domain: "localhost", // Remove port, use only the domain
//             httpOnly: false,
//             secure: false, // Set to true if using HTTPS
//             sameSite: "none", // Or "none" if using HTTPS and cross-site
//             maxAge: 30 * 24 * 60 * 60, // In seconds
//         })
//         .setCookie("google_oauth_verifier", googleCodeVerifier, {
//             path: "/google/callback",
//             domain: "localhost",
//             httpOnly: false,
//             secure: false, // Set to true if using HTTPS
//             sameSite: "none",
//             maxAge: 30 * 24 * 60 * 60,
//         })
//         .header("Access-Control-Allow-Origin", "http://localhost:3000")
//         .header("Access-Control-Allow-Credentials", "true")
//         .send(
//             {
//                 redirectUrl: googleAuthorizationURL.toString()
//             }
//         );

// }

// export const UserCallbackFromGoogle = async (req: FastifyRequest, reply: FastifyReply) => {
//     try {

//         // Ensure @fastify/cookie is registered in your Fastify instance
//         // and that cookies are being sent from the client with credentials: 'include'

//         // Helper to parse cookies from header if req.cookies is empty or missing values
//         function getCookieValue(cookieHeader: string | undefined, key: string): string | undefined {
//             if (!cookieHeader) return undefined;
//             const cookies = cookieHeader.split(';').map(c => c.trim());
//             for (const cookie of cookies) {
//                 const [k, ...v] = cookie.split('=');
//                 if (k === key) return v.join('=');
//             }
//             return undefined;
//         }

//         const storedState = req.cookies?.google_oauth_state || getCookieValue(req.headers['cookie'] as string | undefined, 'google_oauth_state');
//         const codeVerifier = req.cookies?.google_oauth_verifier || getCookieValue(req.headers['cookie'] as string | undefined, 'google_oauth_verifier');
//         if (!storedState) {
//             return reply.status(400).send({ message: "Missing OAuth state from cookie" });
//         } else if (!codeVerifier) {
//             return reply.status(400).send({ message: "Missing OAuth code verifier from cookie" });
//         }

//         // 1. Get code and state from query
//         const { code, state } = req.query as { code?: string; state?: string };
//         if (!code || !state) {
//             return reply.status(400).send({ message: "Missing code or state" })
//         }

//         // 3. Validate state
//         if (process.env.NODE_ENV === "production" && state !== storedState) {
//             return reply.status(400).send({ message: "Invalid state" })
//         }

//         // 4. Exchange code for tokens
//         let tokens: arctic.OAuth2Tokens;
//         try {
//             tokens = await google.validateAuthorizationCode(code, codeVerifier);
//         } catch (err) {
//             return reply.status(401).send({ message: "Failed to exchange code for tokens" })
//         }

//         // 5. Get user info from Google
//         let googleUser;
//         try {
//             googleUser = arctic.decodeIdToken(tokens.idToken());
//         } catch (err) {
//             return reply.status(401).send({ message: "Failed to fetch user info from Google" })
//         }

//         const { sub: googleUserId, googleName, googleProfileImage, googleUserEmail } = googleUser as { sub: string, googleName: string, googleProfileImage: string, googleUserEmail: string };

//         // 6. Find or create user in your DB
//         let existingUser = await LocalUserModel.findOne({ where: { email: googleUserEmail } });
//         let newUser;
//         let newUserDatabaseID;
//         if (!existingUser) {
//             newUser = await SocialUserModel.create({
//                 uid: crypto.randomUUID(),
//                 email: googleUserEmail,
//                 name: googleName,
//                 provider: "google",
//                 providerId: googleUserId,
//                 image: googleProfileImage,
//                 role: "DEFAULT",
//             });
//             newUserDatabaseID = newUser.dataValues.id;
//         }

//         // 7. Generate your own JWT tokens
//         const accessToken = JWT.sign(
//             { id: newUserDatabaseID },
//             envJWTServices.JWT_ACCESS_TOKEN,
//             { expiresIn: "15m" }
//         );
//         const refreshToken = JWT.sign(
//             { id: newUserDatabaseID },
//             envJWTServices.JWT_REFRESH_TOKEN,
//             { expiresIn: "7d" }
//         );

//         // 8. Set cookies
//         setCookie(reply, "access_token", accessToken);
//         setCookie(reply, "refresh_token", refreshToken);
//         reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
//         reply.header("Access-Control-Allow-Credentials", "true");
//         // 9. Redirect to frontend or send success
//         return reply.redirect("http://localhost:3000/dashboard");
//     } catch (error) {
//         return reply.status(500).send({ message: "Internal server error" });
//     }
// }