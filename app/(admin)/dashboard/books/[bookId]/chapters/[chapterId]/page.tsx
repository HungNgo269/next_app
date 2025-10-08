"use server";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchBookByIdActions } from "@/app/actions/bookActions";
import type { Book } from "@/app/interface/book";
import { fetchChapterActions } from "@/app/book/[bookId]/chapter/[chapterId]/action";
import ChapterForm from "@/app/(admin)/dashboard/books/[bookId]/chapters/[chapterId]/updateChapterForm";

type PageProps = {
  params: Promise<{
    bookId: number;
    chapterId: number;
  }>;
};

export default async function UpdateChapterPage({ params }: PageProps) {
  const { bookId, chapterId } = await params;

  const [bookRows, chapter] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchChapterActions(chapterId),
  ]);

  const book = (bookRows?.[0] ?? undefined) as Book | undefined;
  if (!book || !chapter) {
    notFound();
  }
  return (
    <div className="max-w-full mx-auto space-y-6 p-6">
      <Breadcrumb className="mb-6 w-fit rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm">
        <BreadcrumbList className="gap-1.5 sm:gap-2">
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-primary-foreground hover:text-primary-foreground/90"
            >
              <Link href={`/dashboard/`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary-foreground/80" />
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-primary-foreground hover:text-primary-foreground/90"
            >
              <Link href={`/dashboard/books`}>Books</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary-foreground/80" />
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-primary-foreground hover:text-primary-foreground/90"
            >
              <Link href={`/dashboard/books/${bookId}`}>Current Book</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary-foreground/80" />
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-primary-foreground hover:text-primary-foreground/90"
            >
              <Link href={`/dashboard/books/${bookId}/chapters`}>Chapters</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary-foreground/80" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-primary-foreground">
              {chapter.chapter_number}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
      <ChapterForm chapter={chapter} bookId={bookId} />
    </div>
  );
}
