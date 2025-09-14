import { Client } from "@upstash/qstash";

export async function setupQStashCronJob() {
  const client = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  // Schedule to run every hour
  await client.schedules.create({
    destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/sync-views`,
    cron: "0 * * * *", // Every hour at minute 0
    retries: 3,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("cronStarted");
}

export async function cleanupOldViewData(): Promise<void> {
  const redisHold = await import("@/lib/redis");
  const redis = redisHold.redis;
  const pattern = "chapter:*:*";
  const keys = await redis.keys(pattern);

  const batchSize = 100;
  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    if (batch.length > 0) {
      await redis.del(...batch);
    }
  }
}
