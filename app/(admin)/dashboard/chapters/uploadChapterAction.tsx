"use server";

import { ActionResult } from "@/app/interface/actionResult";
import { ChapterSchema } from "@/app/schema/chapterSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function UploadChapterAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const raw = {
      book_id: Number(formData.get("book_id")),
      title: formData.get("title"),
      chapter_number: Number(formData.get("chapter_number")),
      content: formData.get("content"),
    };

    const parsed = ChapterSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const apiFormData = new FormData();
    appendIfDefined(apiFormData, "book_id", parsed.data.book_id);
    appendIfDefined(apiFormData, "title", parsed.data.title);
    appendIfDefined(apiFormData, "chapter_number", parsed.data.chapter_number);
    appendIfDefined(apiFormData, "content", parsed.data.content);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chapters`,
      {
        method: "POST",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Upload failed");
    }

    const result = await response.json();

    if (result?.success) {
      return {
        success: true,
        message: "Chapter created successfully",
        data: result.data,
      };
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    console.error("Upload chapter error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Upload failed. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
