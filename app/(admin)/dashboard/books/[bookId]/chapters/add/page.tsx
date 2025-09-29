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
import CreateChapterForm from "@/app/(admin)/dashboard/books/[bookId]/chapters/add/addChapterForm";

type PageProps = {
  params: Promise<{
    bookId: number;
  }>;
};

export default async function AddChapterPage({ params }: PageProps) {
  const { bookId } = await params;

  const [bookRows] = await Promise.all([fetchBookByIdActions(bookId)]);

  const book = (bookRows?.[0] ?? undefined) as Book | undefined;
  if (!book) {
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
              Add a chapter
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {book.name ?? "-"}
          </h1>
        </div>
      </div>
      <CreateChapterForm bookId={bookId} />
    </div>
  );
}
