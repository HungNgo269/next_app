import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchSlidePages } from "@/app/data/admin/slideData";
import Pagination from "@/app/ui/share/pagination/pagination";
import BookTable from "@/app/ui/admin/books/bookTable";
import { SlideSkeleton } from "@/app/ui/skeletons";
import UserActions from "../slides/userActions";

export const metadata: Metadata = {
  title: "Slides",
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
  const totalPages = await fetchSlidePages(query);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
        <Search placeholder="Search book..." />
      </div>
      <div className="mt-4">
        <UserActions name="Book"></UserActions>
      </div>
      <Suspense key={query + currentPage} fallback={<SlideSkeleton />}>
        <BookTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
