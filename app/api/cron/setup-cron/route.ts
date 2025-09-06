import { setupQStashCronJob } from "../sync-views/route";

let isInitialized = false;

export async function POST() {
  if (!isInitialized) {
    try {
      await setupQStashCronJob();
      isInitialized = true;
      return Response.json({ message: "Cron job setup successfully" });
    } catch (error) {
      return Response.json({ error: "Failed to setup" }, { status: 500 });
    }
  }
  return Response.json({ message: "Already initialized" });
}
