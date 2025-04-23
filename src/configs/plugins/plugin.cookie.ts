import cookie from "@fastify/cookie";
import fp from "fastify-plugin";
import type { FastifyCookieOptions } from "@fastify/cookie";
import type { FastifyInstance } from "fastify";
import { envJWTServices } from "../constants/config.env";

const cookiePlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.register(cookie, {
      secret: envJWTServices.JWT_SECRET_TOKEN, // for cookies signature
      parseOptions: {}, // options for parsing cookies
    } as FastifyCookieOptions);
  },
  {
    name: "cookie",
  }
);

export default cookiePlugin;
