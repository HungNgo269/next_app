import Search from "@/app/ui/share/search/search";
import { Metadata } from "next";
import { Suspense } from "react";
import Pagination from "@/app/ui/share/pagination/pagination";
import ChapterTable from "@/app/ui/admin/chapters/chapterTable";
import UserActions from "@/components/ui/UserAction";
import { SlideSkeleton } from "@/app/ui/skeletons";
import ChapterEditor from "@/app/ui/admin/text-editor/chapterEditor";
import { fetchChapterPagesAction } from "@/app/actions/chapterAdminActions";

export const metadata: Metadata = {
  title: "Chapter",
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
  const totalPages = await fetchChapterPagesAction(query);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="mt-3 flex items-center justify-between gap-2 md:mt-6">
        <Search placeholder="Search chapter..." />
      </div>
      <UserActions name="Chapter" />
      <Suspense key={query + currentPage} fallback={<SlideSkeleton />}>
        <ChapterTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      <div className="mt-8">
        <ChapterEditor />
      </div>
    </div>
  );
}
