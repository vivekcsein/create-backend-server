import type { FastifyReply } from "fastify";

export const setCookie = (reply: FastifyReply, name: string, value: string) => {
  reply.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 1000,
  });
};
