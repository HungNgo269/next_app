import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await redis.incr("page_views");
  return NextResponse.json({ views: count });
}
