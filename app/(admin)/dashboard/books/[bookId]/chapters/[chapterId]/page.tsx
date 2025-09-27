"use server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchBookByIdActions } from "@/app/actions/bookActions";
import type { Book } from "@/app/interface/book";
import { fetchChapterActions } from "@/app/book/[bookId]/chapter/[chapterId]/action";
import ChapterForm from "@/app/(admin)/dashboard/books/[bookId]/chapters/[chapterId]/chapterForm";

type PageProps = {
  params: Promise<{
    bookId: number;
    chapterId: number;
  }>;
};

export default async function ChapterEditorPage({ params }: PageProps) {
  const { bookId, chapterId } = await params;

  const [bookRows, chapter] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchChapterActions(chapterId),
  ]);

  const book = (bookRows?.[0] ?? undefined) as Book | undefined;
  if (!book || !chapter) {
    notFound();
  }

  // const [state, formAction, isPending] = useActionState(
  //   ChapterAction,
  //   undefined
  // );

  return (
    <div className="max-w-full mx-auto space-y-6 p-6">
      <nav className="flex items-center space-x-2 text-lg text-muted-foreground mb-6">
        <Link
          className="hover:text-foreground transition-colors"
          href={`/dashboard/`}
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link
          className="hover:text-foreground transition-colors"
          href={`/dashboard/books`}
        >
          Books
        </Link>
        <span>/</span>
        <Link
          className="hover:text-foreground transition-colors"
          href={`/dashboard/books/${bookId}`}
        >
          Current Book
        </Link>
        <span>/</span>
        <Link
          className="text-foreground font-medium"
          href={`/dashboard/books/${bookId}/chapters`}
        >
          Chapters
        </Link>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {book.name} Chapter {chapter.chapter_number ?? "-"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {chapter.title ? chapter.title : ""}
          </p>
        </div>
      </div>
      <ChapterForm
        chapterId={chapter.id}
        chapterContent={chapter?.content || ""}
        chapterTitle={chapter?.title || ""}
        bookId={bookId}
      />
    </div>
  );
}
