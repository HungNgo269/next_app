import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const chapter = await sql`SELECT * FROM chapters WHERE id = ${id}`;
      return NextResponse.json({ success: true, data: chapter[0] });
    }

    const chapters = await sql`
      SELECT id, title, chapter_number, book_id, created_at, updated_at
      FROM chapters
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json({ success: true, data: chapters });
  } catch (error) {
    console.error("Chapter fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const bookId = Number(formData.get("book_id"));
    const chapterNumber = Number(formData.get("chapter_number"));

    if (!title || Number.isNaN(bookId) || Number.isNaN(chapterNumber)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO chapters (book_id, title, chapter_number, content)
      VALUES (${bookId}, ${title}, ${chapterNumber}, ${content})
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: { chapter: result[0] } });
  } catch (error) {
    console.error("Chapter create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const bookId = formData.get("book_id");
    const chapterNumber = formData.get("chapter_number");

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Chapter id is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE chapters SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        book_id = COALESCE(${bookId ? Number(bookId) : null}, book_id),
        chapter_number = COALESCE(${chapterNumber ? Number(chapterNumber) : null}, chapter_number),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: { chapter: result[0] } });
  } catch (error) {
    console.error("Chapter update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update chapter" },
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
        { success: false, error: "Chapter id is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM chapters WHERE id = ${id} RETURNING *
    `;

    return NextResponse.json({ success: true, data: { chapter: result[0] } });
  } catch (error) {
    console.error("Chapter delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete chapter" },
      { status: 500 }
    );
  }
}
