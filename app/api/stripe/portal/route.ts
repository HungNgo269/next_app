import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPortalSession } from "@/app/actions/subcriptionsActions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await createPortalSession();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Portal API error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
