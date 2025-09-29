import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchSlidePages } from "@/app/data/admin/slideData";
import SlideTable from "@/app/ui/admin/slides/slideTable";
import Pagination from "@/app/ui/share/pagination/pagination";
import { SlideSkeleton } from "@/app/ui/skeletons";
import UserActions from "@/components/ui/UserAction";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
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
              <Link href={`/dashboard/slides`}>Slides</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
        <Search placeholder="Search slides..." />
      </div>
      <div className="mt-4">
        <UserActions name="Slide"></UserActions>
      </div>
      <Suspense key={query + currentPage} fallback={<SlideSkeleton />}>
        <SlideTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
