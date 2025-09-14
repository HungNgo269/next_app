import { Client } from "@upstash/qstash";

export async function setupQStashCronJob() {
  try {
    const client = new Client({
      token: process.env.QSTASH_TOKEN!,
    });
    const existingSchedules = await client.schedules.list();
    const destination = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/sync-views`;

    const scheduleExists = existingSchedules.some(
      (schedule) => schedule.destination === destination
    );

    if (scheduleExists) {
      console.log("Cron job already exists");
      return { success: true, message: "Cron job already exists" };
    }

    const schedule = await client.schedules.create({
      destination,
      cron: "0 * * * *",
      retries: 3,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "sync" }),
    });

    console.log("Cron job created successfully:", schedule);
    return { success: true, scheduleId: schedule.scheduleId };
  } catch (error) {
    console.error("Failed to setup cron job:", error);
    throw error;
  }
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
