"use server";

import { BookSchema } from "@/app/schema/bookSchema";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  imageUrl?: string;
} | null;

export async function uploadBookAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = {
      name: formData.get("title") as string,
      author: formData.get("author") as string,
      desc: formData.get("desc") as string,
    };

    const validatedFields = BookSchema.safeParse(data);

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
    apiFormData.append("folderName", "Books");
    apiFormData.append("name", validatedFields.data.name);
    apiFormData.append("author", validatedFields.data.author);
    apiFormData.append("desc", validatedFields.data.desc);

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}
      /api/upload/Books`,
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
    if (responseData.Book) {
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
