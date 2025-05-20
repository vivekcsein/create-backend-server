import type { FastifyReply } from "fastify";
import { envCookieValue } from "../../constants/config.env";

export const setCookie = (reply: FastifyReply, name: string, value: string) => {
  reply.cookie(name, value, {
    httpOnly: true,
    secure: envCookieValue.COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    // 30 days maximum time to expire cookie
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
