import { envConfig } from "./config.env";

export const whiteListedServer = [
  "https://www.google.com",
  "http:localhost:5500",
  "http:127.0.0.1:5000",
  "http://localhost:7164/",
  "http://127.0.0.1:7164/",
];

export const blackListedIPs = [];

export const allowedOrigins = [
  `http://localhost:${envConfig.SERVER_PORT}`,
  "http://localhost:3000",
  `http://upstash.io`,
  "https://yourdomain.com",
  "https://accounts.google.com"
  // "http://127.0.0.1:3000",
  // "http://127.0.0.1:7164",
];
