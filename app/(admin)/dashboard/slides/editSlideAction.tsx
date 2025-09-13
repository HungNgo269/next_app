"use server";
import { PatchSlideSchema } from "@/app/schema/slideSchema";
import { appendIfDefined } from "@/lib/utils/helper";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  imageUrl?: string;
} | null;

export async function EditSlideAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Lấy dữ liệu text fields từ form
    const raw = {
      title: formData.get("title"),
      order: formData.get("order"), // sẽ coerce sang number trong schema
      desc: formData.get("desc"),
      redirectLink: formData.get("redirectLink"),
    };

    const parsed = PatchSlideSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // File là tùy chọn trong PATCH
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return { success: false, message: "Please select an image file" };
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return { success: false, message: "File size must be less than 5MB" };
      }
    }

    // Chỉ append những field có giá trị
    const apiFormData = new FormData();
    if (file && file.size > 0) {
      apiFormData.append("file", file);
    }
    apiFormData.append("folderName", "slides");
    appendIfDefined(apiFormData, "title", parsed.data.title);
    appendIfDefined(apiFormData, "desc", parsed.data.desc);
    appendIfDefined(apiFormData, "link", parsed.data.redirectLink);
    appendIfDefined(apiFormData, "order", parsed.data.order);

    const response = await fetch(`http://localhost:3000/api/slides`, {
      method: "PATCH",
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Update failed");
    }

    const result = await response.json();
    const responseData = result.data;
    if (responseData.slide) {
      return {
        success: true,
        message: "Update successful!",
        imageUrl: responseData.image_url,
      };
    } else {
      throw new Error("No data returned from server");
    }
  } catch (error) {
    console.error("Edit error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Update failed. Please try again.";
    return { success: false, message: errorMessage };
  }
}
