import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL
      ? "defined"
      : "undefined",
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN
      ? "defined"
      : "undefined",
    QSTASH_TOKEN: process.env.QSTASH_TOKEN ? "defined" : "undefined",
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY
      ? "defined"
      : "undefined",
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY
      ? "defined"
      : "undefined",
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
      ? "defined"
      : "undefined",
    NODE_ENV: process.env.NODE_ENV,
    UPSTASH_URL_VALUE: process.env.UPSTASH_REDIS_REST_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

    UPSTASH_TOKEN_VALUE: process.env.UPSTASH_REDIS_REST_TOKEN
      ? "starts with: " +
        process.env.UPSTASH_REDIS_REST_TOKEN.substring(0, 10) +
        "..."
      : "undefined",
  });
}
