import { Client } from "@upstash/qstash";

export async function setupQStashCronJob(destinationFromRequest?: string) {
  try {
    const client = new Client({
      token: process.env.QSTASH_TOKEN!,
    });
    const existingSchedules = await client.schedules.list();
    const destination =
      destinationFromRequest ||
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/sync-views`;

    const scheduleExists = existingSchedules.some(
      (schedule) => schedule.destination === destination
    );

    if (scheduleExists) {
      console.log("Cron job already exists");
      return { success: true, message: "Cron job already exists" };
    }

    const schedule = await client.schedules.create({
      destination,
      method: "POST",
      cron: "0 * * * *", //1 tieng
      retries: 3,
      headers: {
        "Content-Type": "application/json",
      },
      body: '{"action":"sync"}',
    });

    console.log("Cron job created successfully:", schedule);
    return { success: true, scheduleId: schedule.scheduleId };
  } catch (error) {
    console.error("Failed to setup cron job:", error);
    throw error;
  }
}
