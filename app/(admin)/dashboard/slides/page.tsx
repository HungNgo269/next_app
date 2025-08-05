import SlideTable from "@/app/ui/slides/slideTable";
import UserActions from "./userActions";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import Pagination from "@/app/ui/invoices/pagination";
import { fetchSlidePages } from "./data";

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
    <div className="max-w-6xl mx-auto p-8">
      <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
        <Search placeholder="Search slides..." />
      </div>
      <div className="mt-4">
        <UserActions></UserActions>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <SlideTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
