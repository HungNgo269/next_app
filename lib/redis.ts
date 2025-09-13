import { Redis } from "@upstash/redis";

// Create a single Redis instance from environment variables.
// Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
export const redis = Redis.fromEnv();

