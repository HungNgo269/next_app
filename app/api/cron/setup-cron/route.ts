import { setupQStashCronJob } from "@/lib/cron";
import { redis } from "@/lib/redis";

export async function POST() {
  const isSetup = await redis.get("cron:setup");
  if (!isSetup) {
    try {
      await setupQStashCronJob();
      await redis.set("cron:setup", "true", { ex: 86400 });
      return Response.json({ message: "Cron job setup successfully" });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
  return Response.json({ message: "Already initialized" });
}
