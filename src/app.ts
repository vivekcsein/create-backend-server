// Import the framework and instantiate it
import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

//Import all typescript instances
import type { FastifyInstance } from "fastify";

//Import all plugins
import dbPlugin from "./configs/database/db.plugin";
import cookiePlugin from "./configs/plugins/plugin.cookie";
import corsPlugin from "./configs/plugins/plugin.cors";
import apiRoutesV1_Plugin from "./configs/plugins/plugin.routesV1";

//Initialize Fastify app
const app: FastifyInstance = Fastify({
  // logger: true,
});

// Register homepage app route
app.get("/", async function handler(_req, _reply) {
  return "Server is fast with fastify";
});

//register all plugins
await app.register(corsPlugin);
await app.register(cookiePlugin);
await app.register(dbPlugin);
await app.register(apiRoutesV1_Plugin);

//not found page app route
app.get("/*", (_req, reply) => {
  reply.status(404).send("Error 404, URL not found");
});

// test database plugin and connecting to mysql database
app.register(
  fastifyPlugin((fastify, _opts, done) => {
    fastify.ready((err) => {
      if (err) {
        console.error("Error connecting to any plugin:", err);
        process.exit(1);
      }
      console.log("Successfully connected to all plugins");
    });
    done();
  })
);

export default app;
