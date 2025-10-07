import { syncViewsToDatabase } from "@/lib/service/syncViewToDB";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  //verify the signature
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });

  const signature = req.headers.get("upstash-signature");
  const body = await req.text();

  try {
    // Verify against the exact requested URL to avoid env/base URL mismatches
    await receiver.verify({
      signature: signature!,
      body,
      url: req.url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
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
