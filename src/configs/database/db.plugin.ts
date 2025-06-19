// plugins/db.js
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import sequelize, { connect_sequelizeDB } from "./db.sequelize"; // Import your Sequelize instance
import { connect_redisDB } from "./db.redis";

// Import all models
import UserModel from "../models/model.users";

// Make Sequelize instance accessible to all routes and handlers
const dbPlugin = async (fastify: FastifyInstance) => {
  connect_sequelizeDB();
  // connect_redisDB();
  fastify.decorate("sequelize", sequelize);
  // Make model accessible
  fastify.decorate("User", UserModel);
};

export default fp(dbPlugin, {
  name: "db",
});
