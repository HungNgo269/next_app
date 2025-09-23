"use server";

import { ActionResult } from "@/app/interface/actionResult";
import { PatchChapterSchema } from "@/app/schema/chapterSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function EditChapterAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = formData.get("id");
    if (!id) {
      return { success: false, message: "Chapter id is required" };
    }

    const bookIdRaw = formData.get("book_id");
    const chapterNumberRaw = formData.get("chapter_number");

    const raw = {
      book_id:
        typeof bookIdRaw === "string" && bookIdRaw !== ""
          ? Number(bookIdRaw)
          : undefined,
      title: formData.get("title") ?? undefined,
      chapter_number:
        typeof chapterNumberRaw === "string" && chapterNumberRaw !== ""
          ? Number(chapterNumberRaw)
          : undefined,
      content: formData.get("content") ?? undefined,
    };

    const parsed = PatchChapterSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const apiFormData = new FormData();
    apiFormData.append("id", String(id));
    appendIfDefined(apiFormData, "book_id", parsed.data.book_id);
    appendIfDefined(apiFormData, "title", parsed.data.title);
    appendIfDefined(apiFormData, "chapter_number", parsed.data.chapter_number);
    appendIfDefined(apiFormData, "content", parsed.data.content);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chapters`,
      {
        method: "PATCH",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Update failed");
    }

    const result = await response.json();

    if (result?.success) {
      return {
        success: true,
        message: "Chapter updated successfully",
        data: result.data,
      };
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    console.error("Edit chapter error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Update failed. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
