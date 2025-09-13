"use server";

import { SlideSchema } from "@/app/schema/slideSchema";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  imageUrl?: string;
} | null;

export async function UploadSlideAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = {
      title: formData.get("title") as string,
      order: formData.get("order") as string,
      desc: formData.get("desc") as string,
      redirectLink: formData.get("redirectLink") as string,
    };

    const validatedFields = SlideSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const file = formData.get("file") as File;
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
    apiFormData.append("file", file);
    apiFormData.append("folderName", "slides");
    apiFormData.append("title", validatedFields.data.title);
    apiFormData.append("desc", validatedFields.data.desc);
    apiFormData.append("link", validatedFields.data.redirectLink);
    apiFormData.append("order", validatedFields.data.order);

    // const baseUrl =
    //   process.env.NODE_ENV === "production"
    //     ? process.env.NEXT_PUBLIC_BASE_URL
    //     : "http://localhost:3000";

    const response = await fetch(`http://localhost:3000/api/slides`, {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Upload failed");
    }

    const result = await response.json();
    const responseData = result.data;
    if (responseData.slide) {
      return {
        success: true,
        message: "Upload successful!",
        imageUrl: responseData.image_url,
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
