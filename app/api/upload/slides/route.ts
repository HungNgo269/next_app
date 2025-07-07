import cloudinary from "@/app/lib/cloudinary";
import { sql } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const slides = await sql`SELECT * from slides ORDER BY display_order`;
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (contentType?.includes("multipart/form-data")) {
      // Nếu gửi lên theo formdata
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file uploaded" },
          { status: 400 }
        );
      }

      // File object -> ArrayBuffer -> Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "uploads",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
      console.log("result", result);
      return NextResponse.json({
        success: true,
        data: result,
      });
    } else if (contentType?.includes("application/json")) {
      //Nếu ảnh dạng JSON
      const body = await req.json();

      if (!body || !body.image) {
        return NextResponse.json(
          { success: false, error: "Image is required" },
          { status: 400 }
        );
      }

      const { image } = body;

      const result = await cloudinary.uploader.upload(image, {
        folder: "uploads",
        resource_type: "auto",
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported content type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid request format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
