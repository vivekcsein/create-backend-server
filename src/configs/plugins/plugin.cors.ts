import fp from "fastify-plugin";
import cors, { type FastifyCorsOptions } from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { allowedOrigins } from "../constants/config.serverlist";

const corsPlugin = fp<FastifyCorsOptions>(
  async (fastify: FastifyInstance, options) => {
    await fastify.register(cors, {
      ...options,
      methods: ["GET", "POST", "PUT", "DELETE"],
      origin: allowedOrigins,
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    });
  },
  {
    name: "cors",
  }
);

export default corsPlugin;
