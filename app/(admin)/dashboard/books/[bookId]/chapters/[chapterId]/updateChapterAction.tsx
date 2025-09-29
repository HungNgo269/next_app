"use server";

import { updateChapter } from "@/app/data/chapterData";
import { ActionResult } from "@/app/interface/actionResult";
import { PatchChapterSchema } from "@/app/schema/chapterSchema";

export async function UpdateChapterAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return {
        message: "Update chapter content fail",
        success: false,
      };
    }
    const raw = {
      content: formData.get("content") || undefined,
      title: formData.get("title") || undefined,
      book_id: formData.get("bookid")
        ? Number(formData.get("bookid"))
        : undefined,
      chapter_number: formData.get("chapterNumber")
        ? Number(formData.get("chapterNumber"))
        : undefined,
    };

    const parse = PatchChapterSchema.safeParse(raw);
    console.log("pares", parse);
    if (!parse.success) {
      return {
        message: "Invalid data format",
        success: false,
      };
    }
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
