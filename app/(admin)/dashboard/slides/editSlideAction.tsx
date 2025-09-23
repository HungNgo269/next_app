"use server";
import { ActionResult } from "@/app/interface/actionResult";
import { PatchSlideSchema } from "@/app/schema/slideSchema";
import { appendIfDefined } from "@/lib/utils/helper";

export async function EditSlideAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const isActive = formData.get("is_active");
    const raw = {
      id: formData.get("id"),
      title: formData.get("title"),
      redirect_url: formData.get("redirect_url"),
      display_order: formData.get("display_order"),
      is_active: typeof isActive === "string" ? isActive === "true" : isActive,
      description: formData.get("description"),
    };

    const parsed = PatchSlideSchema.safeParse(raw);
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
    //tạo formData
    const apiFormData = new FormData();
    //có file thì thêm vào
    if (file && file.size > 0) {
      apiFormData.append("file", file);
    }
    apiFormData.append("folderName", "slides");
    appendIfDefined(apiFormData, "id", raw.id);
    appendIfDefined(apiFormData, "title", parsed.data.title);
    appendIfDefined(apiFormData, "redirect_url", parsed.data.redirect_url);
    appendIfDefined(apiFormData, "display_order", parsed.data.display_order);
    appendIfDefined(apiFormData, "is_active", parsed.data.is_active);
    appendIfDefined(apiFormData, "description", parsed.data.description);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/slides`,
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
    if (responseData.slide) {
      return {
        success: true,
        message: "Update successful!",
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
