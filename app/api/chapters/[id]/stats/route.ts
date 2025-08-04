import { NextRequest, NextResponse } from "next/server";
import ChapterViewService from "@/lib/chapterViewService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id;

    if (!chapterId) {
      return NextResponse.json(
        { error: "Chapter ID is required" },
        { status: 400 }
      );
    }
    const chapterService = new ChapterViewService();
    const stats = await chapterService.getChapterStats(chapterId);

    if (stats) {
      return NextResponse.json(stats);
    } else {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
