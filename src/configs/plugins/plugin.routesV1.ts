import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { envConfig } from "../constants/config.env";
import authRoutes from "../../api/v1/auth/auth.routes";

const apiRoutesV1_Plugin = fp(
  async (fastify: FastifyInstance) => {
    authRoutes.forEach((route) => {
      fastify.register(
        (app, _, done) => {
          app.route(route);
          done();
        },
        { prefix: `${envConfig.API_PATH}/v1/auth` }
      );
    });
  },
  {
    name: "routesV1",
  }
);

export default apiRoutesV1_Plugin;
