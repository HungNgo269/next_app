import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  const count = await redis.incr("page_views");
  return NextResponse.json({ views: count });
}
