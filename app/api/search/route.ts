import { NextResponse } from "next/server";
import { fetchBooksByQuery } from "@/app/data/bookData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) return NextResponse.json({ items: [] }, { status: 200 });
    const items = await fetchBooksByQuery(q);
    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("/api/search error:", err);
    return NextResponse.json(
      { items: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
