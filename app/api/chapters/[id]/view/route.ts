import { NextRequest, NextResponse } from "next/server";
import ChapterViewService from "@/lib/chapterViewService";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = (await request.json()) as { userId?: string };
    const chapterId = params.id;

    if (!chapterId) {
      return NextResponse.json(
        { error: "Chapter ID is required" },
        { status: 400 }
      );
    }
    const chapterService = new ChapterViewService();

    const ipAddress = ChapterViewService.getClientIP(request);

    const result = await chapterService.incrementView(
      chapterId,
      userId,
      ipAddress
    );

    if (result.success) {
      return NextResponse.json({
        message: "View recorded successfully",
        totalViews: result.totalViews,
        dailyViews: result.dailyViews,
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to record view" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
