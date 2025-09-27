import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchBookPagesActions } from "@/app/actions/bookActions";
import Pagination from "@/app/ui/share/pagination/pagination";
import BookTable from "@/app/ui/admin/books/bookTable";
import { SlideSkeleton } from "@/app/ui/skeletons";
import UserActions from "@/components/ui/UserAction";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Books",
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
      <nav className="flex items-center space-x-2 text-lg text-muted-foreground mb-6">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/books" className="font-medium text-foreground">
          Books
        </Link>
      </nav>
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
