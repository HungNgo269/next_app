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
    const description = formData.get("description") as string;
    const redirect_url = formData.get("redirect_url") as string;
    const display_order = formData.get("display_order") as string;
    const is_active = formData.get("is_active") as string;
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }
    console.log("check file", file.name, file.size, file.type);
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
              else resolve(result!);
            }
          )
          .end(buffer);
      }
    );

    try {
      const dbResult = await sql`
        INSERT INTO slides (title, description, image_url, public_id, redirect_url, display_order,is_active)
        VALUES (${title}, ${description}, ${cloudinaryResult.secure_url}, ${cloudinaryResult.public_id}, ${redirect_url}, ${display_order},${is_active})
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

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folderName = formData.get("folderName") as string;
    const id = formData.get("id") as string;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const redirect_url = formData.get("redirect_url") as string;
    const display_order = formData.get("display_order") as string;
    const is_active = formData.get("is_active") as string;

    const file = formData.get("image") as File;
    console.log("formData", formData);
    let cloudinaryResult: UploadApiResponse | null = null;
    let oldPublicId: string | null = null;

    // Nếu có file mới, upload lên Cloudinary
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Lấy public_id cũ để xóa sau
      const existingSlide = await sql`
        SELECT public_id FROM slides WHERE id = ${id}
      `;

      if (existingSlide.length > 0) {
        oldPublicId = existingSlide[0].public_id;
      }

      cloudinaryResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: folderName,
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result!);
              }
            )
            .end(buffer);
        }
      );
    }

    try {
      let dbResult;
      if (cloudinaryResult) {
        dbResult = await sql`
          UPDATE slides SET 
            title = ${title},
            description = ${description},
            image_url = ${cloudinaryResult.secure_url},  
            redirect_url = ${redirect_url},
            display_order = ${display_order},
            public_id = ${cloudinaryResult.public_id},
            is_active = ${is_active},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        dbResult = await sql`
          UPDATE slides SET 
            title = ${title},
            description = ${description},
             redirect_url = ${redirect_url},
            display_order = ${display_order},
            is_active = ${is_active},

            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
      }

      // Xóa ảnh cũ trên Cloudinary nếu có ảnh mới
      if (cloudinaryResult && oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (deleteError) {
          console.warn("Failed to delete old image:", deleteError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          slide: dbResult[0],
          cloudinary: cloudinaryResult,
        },
      });
    } catch (dbError) {
      if (cloudinaryResult) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get("id") as string;
  try {
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Slide ID is required" },
        { status: 400 }
      );
    }

    const existingSlide = await sql`
      SELECT public_id FROM slides WHERE id = ${id}
    `;

    if (existingSlide.length === 0) {
      return NextResponse.json(
        { success: false, error: "Slide not found" },
        { status: 404 }
      );
    }

    const dbResult = await sql`
      DELETE FROM Slides WHERE id = ${id}
      RETURNING *
    `;

    if (existingSlide[0].public_id) {
      try {
        await cloudinary.uploader.destroy(existingSlide[0].public_id);
      } catch (deleteError) {
        console.warn("Failed to delete image from Cloudinary:", deleteError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        book: dbResult[0],
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}
