import { NextResponse } from "next/server";

export async function GET() {
  const redisHold = await import("@/lib/redis");
  const redis = redisHold.redis;
  const count = await redis.incr("page_views");
  return NextResponse.json({ views: count });
}
