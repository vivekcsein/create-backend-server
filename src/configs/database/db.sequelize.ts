import { Sequelize } from "sequelize";
import { envMysqlDB } from "../constants/config.env";

const sequelize = new Sequelize({
  database: envMysqlDB.DB_NAME,
  username: envMysqlDB.DB_USERNAME,
  password: envMysqlDB.DB_PASSWORD,
  host: envMysqlDB.DB_HOST,
  dialect: "mysql", // or 'mariadb' if using MariaDB
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connect_sequelizeDB = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    const DB_Sync: boolean = Boolean(envMysqlDB.DB_SYNC);
    console.log("Successfully connected to the mysql database");
    // Sync models with the database (optional, but recommended)
    await sequelize.sync({ force: DB_Sync }); // Set force: true to drop and recreate tables
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
