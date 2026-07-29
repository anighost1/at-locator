import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
};