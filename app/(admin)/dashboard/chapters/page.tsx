import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchBookPagesActions } from "@/app/actions/bookActions";
import Pagination from "@/app/ui/share/pagination/pagination";
import BookTable from "@/app/ui/admin/books/bookTable";
import { SlideSkeleton } from "@/app/ui/skeletons";
import UserActions from "@/components/ui/UserAction";
import ChapterTable from "@/app/ui/admin/chapters/chapterTable";

export const metadata: Metadata = {
  title: "Chapters",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchBookPagesActions(query);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
        <Search placeholder="Search Chapter..." />
      </div>
      <div className="mt-4">
        <UserActions name="Chapter"></UserActions>
      </div>
      <Suspense key={query + currentPage} fallback={<SlideSkeleton />}>
        <ChapterTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
