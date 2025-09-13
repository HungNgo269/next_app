import { syncViewsToDatabase } from "@/lib/chapterViewService";
import redis from "@/lib/redis";
import { Client, Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Manual signature verification cho App Router
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });

  const signature = req.headers.get("upstash-signature");
  const body = await req.text();

  try {
    await receiver.verify({
      signature: signature!,
      body,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Your handler logic
  try {
    const result = await syncViewsToDatabase();

    console.log(`Synced ${result.processed} views to database`);
    if (result.errors.length > 0) {
      console.error("Sync errors:", result.errors);
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 207,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
