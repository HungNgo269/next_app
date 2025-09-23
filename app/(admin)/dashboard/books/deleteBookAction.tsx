"use server";

import { ActionResult } from "@/app/interface/actionResult";

export async function DeleteBookAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = formData.get("id");

    if (!id) {
      return {
        success: false,
        message: "Book id is required",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/book?id=${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Delete failed");
    }

    const result = await response.json();

    if (result?.success) {
      return {
        success: true,
        message: "Delete successful!",
      };
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    console.error("Delete book error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Delete failed. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
