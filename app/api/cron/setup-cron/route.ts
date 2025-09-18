import { setupQStashCronJob } from "@/lib/cron";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { origin } = new URL(req.url);
  const setupKey = `cron:setup:${origin}`;
  const isSetup = await redis.get(setupKey);
  if (!isSetup) {
    try {
      const destination = `${origin}/api/cron/sync-views`;
      await setupQStashCronJob(destination);
      await redis.set(setupKey, "true", { ex: 86400 });
      return Response.json({ message: "Cron job setup successfully" });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
  return Response.json({ message: "Already initialized" });
}
