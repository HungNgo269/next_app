import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { auth, handlers } from "@/auth";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req: NextRequest) {
  const { userId, fontSize } = await req.json(); // Giả sử có userId từ auth
  await redis.set(`user:${userId}:fontsize`, fontSize, { ex: 86400 }); // Hết hạn sau 1 ngày
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const fontSize = await redis.get(`user:${session?.user.id}:fontsize`);
  return NextResponse.json({ fontSize: fontSize || 16 });
}
