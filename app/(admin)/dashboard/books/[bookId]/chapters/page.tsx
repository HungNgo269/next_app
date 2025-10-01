import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  fetchBookNameByBookIdAction,
  fetchTotalChapterInBookByIdAction,
} from "@/app/actions/bookActions";
import { fetchChapterOfBookAction } from "@/app/actions/chapterActions";
import { Button } from "@/components/ui/button";

import ChapterTable from "@/app/ui/admin/chapters/chapterTable";
import Search from "@/app/ui/share/search/search";
import Pagination from "@/app/ui/share/pagination/pagination";
import { Suspense } from "react";
import { SlideSkeleton } from "@/app/ui/skeletons";

type PageProps = {
  params: Promise<{
    bookId: number;
  }>;

  searchParams: Promise<{
    query: string;

    page: number;
  }>;
};

export default async function BookChaptersPage({
  params,

  searchParams,
}: PageProps) {
  const { bookId } = await params;

  let { query, page } = await searchParams;

  if (!page) {
    page = 1;
  }

  if (!query) {
    query = "";
  }

  const [bookName, chapters, totalChapters] = await Promise.all([
    fetchBookNameByBookIdAction(bookId),

    fetchChapterOfBookAction(bookId),

    fetchTotalChapterInBookByIdAction(bookId),
  ]);

  const totalPage = Math.ceil(totalChapters / 10);

  return (
    <div className="max-w-full mx-auto p-8">
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
              <Link href={`/dashboard/books/${bookId}`}>{bookName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-primary-foreground/80" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-primary-foreground">
              Chapters
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold text-foreground">{bookName}</h1>

          <p className="text-sm text-muted-foreground">
            Total {totalChapters} chapter{totalChapters === 1 ? "" : "s"}
          </p>
        </div>

        <Button>
          <Link
            title="Edit chapter"
            href={`/dashboard/books/${bookId}/chapters/add`}
          >
            Add a chapter
          </Link>
        </Button>
      </div>

      <div className="p-0 mt-5">
        {chapters.length > 0 ? (
          <div className="max-w-full mx-auto p-8 space-y-8">
            <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
              <Search placeholder="Search chapter..." />
            </div>

            <Suspense key={query + page} fallback={<SlideSkeleton />}>
              <ChapterTable query={query} currentPage={page} bookId={bookId} />
            </Suspense>

            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPage} />
            </div>
          </div>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            No chapters found for this book.
          </div>
        )}
      </div>
    </div>
  );
}
