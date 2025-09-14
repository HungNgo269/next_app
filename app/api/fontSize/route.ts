import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  const redisHold = await import("@/lib/redis");
  const redis = redisHold.redis;
  const fontSize = await redis.get(`user:${session?.user.id}:fontsize`);
  return NextResponse.json({ fontSize: fontSize || 16 });
}
