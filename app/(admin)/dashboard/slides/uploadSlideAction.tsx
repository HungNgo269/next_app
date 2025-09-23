"use server";

import { ActionResult } from "@/app/interface/actionResult";
import { SlideSchema } from "@/app/schema/slideSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function UploadSlideAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const isActive = formData.get("is_active");
    const raw = {
      title: formData.get("title"),
      redirect_url: formData.get("redirect_url"),
      display_order: formData.get("display_order"),
      is_active: typeof isActive === "string" ? isActive === "true" : isActive,
      description: formData.get("description"),
    };

    const parsed = SlideSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const file = formData.get("image") as File;
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

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size must be less than 5MB",
      };
    }

    const apiFormData = new FormData();
    apiFormData.append("folderName", "slides");
    appendIfDefined(apiFormData, "title", parsed.data.title);
    appendIfDefined(apiFormData, "redirect_url", parsed.data.redirect_url);
    appendIfDefined(apiFormData, "display_order", parsed.data.display_order);
    appendIfDefined(apiFormData, "is_active", parsed.data.is_active);
    appendIfDefined(apiFormData, "description", parsed.data.description);
    appendIfDefined(apiFormData, "image", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/slides`,
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
    const slide = result?.data?.slide;
    const responseData = result.data;
    console.log("check result", result);
    if (slide?.public_id && slide?.secure_url) {
      return {
        success: true,
        message: "Upload successful!",
        data: { public_id: slide.public_id, secure_url: slide.secure_url },
      };
    }

    if (responseData.slide) {
      return {
        success: true,
        message: "Upload successful!",
      };
    } else {
      throw new Error("No URL returned from server");
    }
  } catch (error) {
    console.error("Upload error:", error);
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
