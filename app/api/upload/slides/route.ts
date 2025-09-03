import cloudinary from "@/lib/cloudinary";
import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UploadApiResponse } from "cloudinary";

export async function GET() {
  try {
    const slides =
      await sql`SELECT * from slides ORDER BY display_order LIMIT 7`;
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
    const formData = await req.formData();
    const folderName = formData.get("folderName") as string;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const link = formData.get("link") as string;
    const order = formData.get("order") as string;

    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinaryResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: folderName,
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!); // Non-null assertion vì đã check error
            }
          )
          .end(buffer);
      }
    );

    try {
      const dbResult = await sql`
        INSERT INTO slides (title, description, image_url, public_id,redirect_url,display_order)
        VALUES (${title}, ${desc}, ${cloudinaryResult.secure_url}, ${cloudinaryResult.public_id},${link},${order})
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        data: {
          slide: dbResult[0],
          cloudinary: cloudinaryResult,
        },
      });
    } catch (dbError) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      throw dbError;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
