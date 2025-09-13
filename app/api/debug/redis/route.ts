import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic"; // ensure it runs server-side on each call

export async function GET() {
  try {
    // Minimal roundtrip to verify credentials actually work at runtime
    const key = "debug:ping";
    await redis.set(key, "pong", { ex: 30 });
    const value = await redis.get<string>(key);

    return NextResponse.json({
      ok: true,
      upstash: {
        urlDefined: !!process.env.UPSTASH_REDIS_REST_URL,
        tokenDefined: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      },
      result: value,
    });
  } catch (err: any) {
    // Surface helpful info without leaking secrets
    return NextResponse.json(
      {
        ok: false,
        message: err?.message || "Unknown error",
        name: err?.name,
        upstash: {
          urlDefined: !!process.env.UPSTASH_REDIS_REST_URL,
          tokenDefined: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}

