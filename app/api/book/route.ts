import cloudinary from "@/lib/cloudinary";
import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UploadApiResponse } from "cloudinary";

export async function GET() {
  try {
    const books = await sql`
      SELECT * FROM books 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(books);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folderName = formData.get("folderName") as string;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const is_active = formData.get("is_active") as string;

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
              else resolve(result!);
            }
          )
          .end(buffer);
      }
    );

    try {
      const dbResult = await sql`
        INSERT INTO books (name, description, author, image_urls, public_ids, is_active)
        VALUES (
          ${name}, 
          ${description}, 
          ${author}, 
          ARRAY[${cloudinaryResult.secure_url}], 
          ARRAY[${cloudinaryResult.public_id}], 
          ${is_active}
        )
        RETURNING *
      `;

      return NextResponse.json({
        success: true,
        data: {
          book: dbResult[0],
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

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const is_active = formData.get("is_active") as string;

    const file = formData.get("file") as File;
    console.log("formData", formData);
    let cloudinaryResult: UploadApiResponse | null = null;
    let oldPublicIds: string[] = [];

    // Nếu có file mới, upload lên Cloudinary
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Lấy public_ids cũ để xóa sau
      const existingBook = await sql`
        SELECT public_ids FROM books WHERE id = ${id}
      `;

      if (existingBook.length > 0 && existingBook[0].public_ids) {
        oldPublicIds = existingBook[0].public_ids;
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
        // Cập nhật với ảnh mới
        dbResult = await sql`
          UPDATE books SET 
            name = ${name},
            description = ${description},
            author = ${author},
            image_urls = ARRAY[${cloudinaryResult.secure_url}],
            public_ids = ARRAY[${cloudinaryResult.public_id}],
            is_active = ${is_active},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        // Cập nhật không thay đổi ảnh
        dbResult = await sql`
          UPDATE books SET 
            name = ${name},
            description = ${description},
            author = ${author},
            is_active = ${is_active},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
      }

      // Xóa ảnh cũ trên Cloudinary nếu có ảnh mới
      if (cloudinaryResult && oldPublicIds.length > 0) {
        try {
          // Xóa tất cả ảnh cũ
          for (const publicId of oldPublicIds) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (deleteError) {
          console.warn("Failed to delete old images:", deleteError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          book: dbResult[0],
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
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Lấy thông tin book để xóa ảnh trên Cloudinary
    const existingBook = await sql`
      SELECT public_ids FROM books WHERE id = ${id}
    `;

    if (existingBook.length === 0) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    // Xóa book khỏi database
    const dbResult = await sql`
      DELETE FROM books WHERE id = ${id}
      RETURNING *
    `;

    // Xóa ảnh trên Cloudinary
    if (existingBook[0].public_ids && existingBook[0].public_ids.length > 0) {
      try {
        for (const publicId of existingBook[0].public_ids) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (deleteError) {
        console.warn("Failed to delete images from Cloudinary:", deleteError);
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
