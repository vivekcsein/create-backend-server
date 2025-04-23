import app from "./app";
import { envConfig } from "./configs/constants/config.env";

//Config Server Port to be use, so make sure setup SERVER_PORT in env file
if (!envConfig.SERVER_PORT) {
  process.exit(1);
}
const PORT: number = envConfig.SERVER_PORT;

//Setup API path for the safety of the api
if (!envConfig.API_PATH) {
  process.exit(1);
}

// start server
const startserver = async () => {
  try {
    await new Promise((resolve) => {
      app.listen({ port: PORT }, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        resolve("server started");
      });
    });
  } catch (err) {
    app.log.error(err);
    console.error("Server can not start: ", err);
    process.exit(1);
  }
};

startserver();
