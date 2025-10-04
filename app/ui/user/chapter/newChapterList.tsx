"use server";
//  Server Component chỉ nhận searchParams tự động nếu nó là PAGE component, không phải component con.
import { Suspense } from "react";
import Pagination from "@/app/ui/share/pagination/pagination";
import { fetchTotalChapterPageAction } from "@/app/actions/chapterActions";
import ChapterGrid from "@/app/ui/user/chapter/chapterGrid";
import { ChapterCardGridSkeleton } from "@/app/ui/skeletons";

interface props {
  searchParams?: string;
}

export default async function NewChapterList({ searchParams }: props) {
  const currentPage = Number(searchParams) || 1;
  const totalPages = await fetchTotalChapterPageAction();
  return (
    <div
      className="flex flex-col justify-center items-center gap-4"
      id="new_chapter"
    >
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <span className="font-bold text-2xl text-start flex-1 min-w-0 truncate">
          New Chapter
        </span>
      </div>

      <Suspense key={currentPage} fallback={<ChapterCardGridSkeleton />}>
        <ChapterGrid page={currentPage} />
      </Suspense>

      <div className="flex justify-center items-center mt-4">
        <Pagination totalPages={totalPages} hashUrl="new_chapter" />
      </div>
    </div>
  );
}
