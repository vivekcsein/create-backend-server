// plugins/db.js
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import sequelize, { connect_sequelizeDB } from "./db.sequelize"; // Import your Sequelize instance
import { connect_redisDB } from "./db.redis";

// Import all models
import LocalUserModel from "../models/model.LocalUsers";
import SocialUserModel from "../models/model.SocialUsers";

// Make Sequelize instance accessible to all routes and handlers
const dbPlugin = async (fastify: FastifyInstance) => {
  connect_sequelizeDB();
  // connect_redisDB();
  fastify.decorate("sequelize", sequelize);
  // Make model accessible
  fastify.decorate("LocalUsers", LocalUserModel);
  fastify.decorate("SocialUsers", SocialUserModel);
};

export default fp(dbPlugin, {
  name: "db",
});
