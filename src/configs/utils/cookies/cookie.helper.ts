import type { FastifyReply } from "fastify";
import { envCookieValue } from "../../constants/config.env";

export const setCookie = (reply: FastifyReply, name: string, value: string, options?: {
  httpOnly?: boolean;
  secure?: boolean;
}) => {
  reply.cookie(name, value, {
    httpOnly: options?.httpOnly ? options.httpOnly : true,
    secure: options?.secure ? options.secure : envCookieValue.COOKIE_SECURE,
    // sameSite: "lax",
    // path: "/",
    // 30 days maximum time to expire cookie
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
