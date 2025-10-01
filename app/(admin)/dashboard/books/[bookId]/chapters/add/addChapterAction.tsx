"use server";

import { notifyNewChapter } from "@/app/actions/notificationsAction";
import { createChapter } from "@/app/data/chapterData";
import { ActionResult } from "@/app/interface/actionResult";
import { ChapterSchema } from "@/app/schema/chapterSchema";

export async function CreateChapterAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const raw = {
      content: formData.get("content") || "",
      title: formData.get("title") || "",
      book_id: formData.get("bookid")
        ? Number(formData.get("bookid"))
        : undefined,
      chapter_number: formData.get("chapterNumber")
        ? Number(formData.get("chapterNumber"))
        : undefined,
    };
    const parse = ChapterSchema.safeParse(raw);
    if (!parse.success) {
      return {
        message: "Invalid data format",
        success: false,
      };
    }
    const result = await createChapter({
      content: parse.data?.content,
      title: parse.data.title || "",
      chapterNumber: parse.data.chapter_number,
      bookId: parse.data.book_id,
    });
    const chapter = result;
    if (!result) {
      return {
        message: "Create chapter content fail",
        success: false,
      };
    }
    setTimeout(async () => {
      await notifyNewChapter(chapter);
    }, 5000);
    return {
      message: "Create chapter content success",
      success: true,
    };
  } catch (error) {
    return {
      message: "Create chapter content fail",
      success: false,
    };
  }
}
