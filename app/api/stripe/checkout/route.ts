import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession } from "@/app/data/subcriptions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const result = await createCheckoutSession(priceId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
