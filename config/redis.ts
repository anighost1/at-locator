import { createClient } from "redis";
import { env } from "./env.js";

const redis = createClient({
    socket: {
        host: String(env.REDIS_HOST),
        port: Number(env.REDIS_PORT),
    },
    password: env.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
    console.log("Redis Connected");
});

redis.on("error", (err) => {
    console.error("Redis Error:", err);
});

(async () => {
    await redis.connect();
})();

export default redis