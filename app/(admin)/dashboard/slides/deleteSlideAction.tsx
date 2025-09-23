"use server";

import { ActionResult } from "@/app/interface/actionResult";

export async function DeleteSlideAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    const apiFormData = new FormData();
    apiFormData.append("id", id);
    console.log("first", apiFormData);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/slides`,
      {
        method: "DELETE",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Delete failed");
    }
    const result = await response.json();

    if (result) {
      return {
        success: true,
        message: "Delete successful!",
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
