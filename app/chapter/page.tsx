import Pagination from "@/app/ui/share/pagination/pagination";
import { fetchTotalChapterPageAction } from "@/app/actions/chapterActions";
import ChapterList from "./chapterlist";
import { Suspense } from "react";
import { BookCardSkeleton } from "../ui/skeletons";
interface PageProps {
  searchParams: Promise<{ page: number }>;
}
export default async function ChapterPage({ searchParams }: PageProps) {
  let currentPage = (await searchParams).page;
  if (currentPage === null || currentPage === undefined) {
    currentPage = 1;
  }
  const [totalPages] = await Promise.all([fetchTotalChapterPageAction()]);
  return (
    <div className="w-full">
      <span className="font-bold text-2xl text-start whitespace-nowrap">
        Newest Chapter
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 w-full mx-auto">
        <Suspense fallback={<BookCardSkeleton></BookCardSkeleton>}>
          <ChapterList currentPage={currentPage}></ChapterList>
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center ">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
