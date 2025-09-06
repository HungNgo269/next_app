import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req: NextRequest) {
  const session = await auth();
  const fontSize = await redis.get(`user:${session?.user.id}:fontsize`);
  return NextResponse.json({ fontSize: fontSize || 16 });
}
