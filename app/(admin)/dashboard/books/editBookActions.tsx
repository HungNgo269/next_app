"use server";

import { ActionResult } from "@/app/interface/actionResult";
import { PatchBookSchema } from "@/app/schema/bookSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function EditBookAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const isActive = formData.get("is_active");
    const id = formData.get("id");
    const raw = {
      name: formData.get("name"),
      description: formData.get("description"),
      author: formData.get("author"),
      is_active: typeof isActive === "string" ? isActive === "true" : isActive,
    };

    const parsed = PatchBookSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return { success: false, message: "Please select an image file" };
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return { success: false, message: "File size must be less than 5MB" };
      }
    }

    const apiFormData = new FormData();

    if (file && file.size > 0) {
      apiFormData.append("file", file);
    }
    apiFormData.append("folderName", "books");

    appendIfDefined(apiFormData, "id", id);
    appendIfDefined(apiFormData, "name", parsed.data.name);
    appendIfDefined(apiFormData, "description", parsed.data.description);
    appendIfDefined(apiFormData, "author", parsed.data.author);
    appendIfDefined(apiFormData, "is_active", parsed.data.is_active);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/book`,
      {
        method: "PATCH",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Update failed");
    }

    const result = await response.json();
    const responseData = result.data;

    if (responseData.book) {
      return {
        success: true,
        message: "Update successful!",
      };
    } else {
      throw new Error("No data returned from server");
    }
  } catch (error) {
    console.error("Edit book error:", error);
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
