// server/redis.js
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
}

connectRedis();

export default redisClient;
