"use server";

import { ActionResult } from "@/app/interface/actionResult";
import { BookSchema } from "@/app/schema/bookSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function UploadBookAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const isActive = formData.get("is_active");
    const raw = {
      name: formData.get("name"),
      author: formData.get("author"),
      description: formData.get("description"),
      is_active:
        typeof isActive === "string" ? isActive === "true" : Boolean(isActive),
    };

    const parsed = BookSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return {
        success: false,
        message: "Please select a file",
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "Please select an image file",
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size must be less than 5MB",
      };
    }

    const apiFormData = new FormData();
    apiFormData.append("folderName", "books");
    apiFormData.append("file", file);
    appendIfDefined(apiFormData, "name", parsed.data.name);
    appendIfDefined(apiFormData, "author", parsed.data.author);
    appendIfDefined(apiFormData, "description", parsed.data.description);
    appendIfDefined(apiFormData, "is_active", parsed.data.is_active);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/book`,
      {
        method: "POST",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Upload failed");
    }

    const result = await response.json();
    const responseData = result.data;

    if (responseData?.book) {
      return {
        success: true,
        message: "Upload successful!",
        data: responseData,
      };
    }

    throw new Error("No data returned from server");
  } catch (error) {
    console.error("Upload book error:", error);
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
