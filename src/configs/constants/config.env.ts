import * as dotenv from "dotenv";
dotenv.config();

const _envConfig = {
    //development or build configs
    NODE_ENV: process.env.NODE_ENV || ("development" as string),

    //server env configs
    SERVER_PORT: parseInt(process.env.SERVER_PORT as string, 10) | 7164,

    //api routes or path
    API_PATH: process.env.API_PATH as string,
};

const _envMysqlDB = {
    //mysql database env configs
    DB_URL: process.env.DB_URL as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_USERNAME: process.env.DB_USERNAME as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    DB_SYNC: Boolean(process.env.DB_SYNC),
    DB_PORT: parseInt(process.env.SERVER_PORT as string, 10) | (3306 as number),
};

//redis database config
const _envRedisDB = {
    DB_URL: process.env.DB_REDIS_URL as string,
    DB_TOKEN: process.env.DB_REDIS_TOKEN as string,
}

//mail service configs
const _envMailServices = {
    SMTP_URL: process.env.SMTP_URL as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_SERVICE: process.env.SMTP_SERVICE as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    SMTP_PORT: parseInt(process.env.SMTP_PORT as string, 10) | (465 as number),
}

const _envJWTServices = {
    JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN as string,
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
    JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
}

export const envConfig = Object.freeze(_envConfig);
export const envMysqlDB = Object.freeze(_envMysqlDB);
export const envRedisDB = Object.freeze(_envRedisDB);
export const envMailServices = Object.freeze(_envMailServices);
export const envJWTServices = Object.freeze(_envJWTServices);



