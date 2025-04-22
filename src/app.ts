
// Import the framework and instantiate it
import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

//Import all typescript instances
import type { FastifyInstance, FastifyRequest } from "fastify";

//Import all plugins
import dbPlugin from "./configs/database/db.plugin";

//Initialize Fastify app
const app: FastifyInstance = Fastify({
    // logger: true,
});

//register all plugins
await app.register(dbPlugin);

// test database plugin and connecting to mysql database
app.register(fastifyPlugin((fastify, _opts, done) => {
    fastify.ready((err) => {
        if (err) {
            console.error('Error connecting to any plugin:', err);
            process.exit(1);
        }
        console.log('Successfully connected to all plugins');
    });
    done();
}))

// Register homepage app route
app.get("/", async function handler(request, reply) {
    return "Server is fast with fastify";
});

//not found page app route
app.get("/*", (req, reply) => {
    req ? "" : "";
    reply.status(404).send("Error 404, URL not found");
});

export default app;