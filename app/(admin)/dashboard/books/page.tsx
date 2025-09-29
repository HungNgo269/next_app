import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchBookPagesActions } from "@/app/actions/bookActions";
import Pagination from "@/app/ui/share/pagination/pagination";
import BookTable from "@/app/ui/admin/books/bookTable";
import { SlideSkeleton } from "@/app/ui/skeletons";
import UserActions from "@/components/ui/UserAction";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
            <BreadcrumbPage className="font-semibold text-primary-foreground">
              <Link href={`/dashboard/books`}>Books</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
