import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const session = await auth();
  const fontSize = await redis.get(`user:${session?.user.id}:fontsize`);
  return NextResponse.json({ fontSize: fontSize || 16 });
}
