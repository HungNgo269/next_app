import { syncViewsToDatabase } from "@/lib/chapterViewService";
import { sql } from "@/lib/db";
import redis from "@/lib/redis";
import { Client } from "@upstash/qstash";
import { verifySignature } from "@upstash/qstash/nextjs";

export const POST = verifySignature(async (req) => {
  try {
    const result = await syncViewsToDatabase();

    console.log(`Synced ${result.processed} views to database`);
    if (result.errors.length > 0) {
      console.error("Sync errors:", result.errors);
    }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 207, // 207 for partial success
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

export async function setupQStashCronJob() {
  const client = new Client({
    token: process.env.QSTASH_TOKEN!,
  });
  // Schedule to run every hour
  await client.schedules.create({
    destination: `http://26.95.123.207:3000/api/cron/sync-views`,
    // destination: `${process.env.NEXT_PUBLIC_APP_URL }/api/cron/sync-views`,

    cron: "0 * * * *", // Every hour at minute 0
    retries: 3,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("cronStarted");
}

export async function cleanupOldViewData(): Promise<void> {
  // daysToKeep: number = 30
  const pattern = "*:viewed:*";
  const keys = await redis.keys(pattern);

  const batchSize = 100;
  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    if (batch.length > 0) {
      await redis.del(...batch);
    }
  }
}

export async function getViewAnalytics(
  chapterId: number,
  dateRange?: { start: Date; end: Date }
): Promise<any> {
  let query = `
    SELECT 
      DATE(viewed_at) as date,
      COUNT(*) as total_views,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT ip_address) as unique_ips
    FROM chapter_views
    WHERE chapter_id = $1
  `;

  const params: any[] = [chapterId];

  if (dateRange) {
    query += ` AND viewed_at BETWEEN $2 AND $3`;
    params.push(dateRange.start.toISOString(), dateRange.end.toISOString());
  }

  query += ` GROUP BY DATE(viewed_at) ORDER BY date DESC`;

  const result = await sql`${query}`;
  return result;
}
