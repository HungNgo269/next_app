"use server";

import { updateChapter } from "@/app/data/chapterData";
import { ActionResult } from "@/app/interface/actionResult";
import { ChapterSchema } from "@/app/schema/chapterSchema";

export async function ChapterAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return {
        message: "Upsert chapter content fail",
        success: false,
      };
    }

    const raw = {
      content: formData.get("content"),
      title: formData.get("title"),
      bookid: formData.get("bookid"),
      chapterNumber: formData.get("chapterNumber"),
    };
    const parse = ChapterSchema.safeParse(raw);

    if (!parse.success) {
      return {
        message: "Invalid data format",
        success: false,
      };
    }
    //truyen 1 object => ko can thu tu
    const result = await updateChapter({
      id: parseInt(id),
      content: parse.data.content || "",
      title: parse.data.title || "",
      chapterNumber: parse.data.chapter_number || 0,
      bookId: parse.data.book_id || 0,
    });
    console.log("Update result:", result);

    return {
      message: "Update chapter content success",
      success: true,
    };
  } catch (error) {
    return {
      message: "Update chapter content fail",
      success: false,
    };
  }
}
