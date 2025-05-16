import type { FastifyReply } from "fastify";

export const setCookie = (reply: FastifyReply, name: string, value: string) => {
  reply.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // 30 days maximum time to expire cookie
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
