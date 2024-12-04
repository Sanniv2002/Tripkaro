import Redis from "ioredis";

const ENABLE_CACHE = process.env.ENABLE_CACHE === "true";

let redis:any;

if (ENABLE_CACHE) {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });
}

export default redis;