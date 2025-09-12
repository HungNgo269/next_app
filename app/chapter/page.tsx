import Pagination from "@/app/ui/share/pagination/pagination";
import {
  fetchNewestChapterAction,
  fetchTotalChapterPageAction,
} from "@/app/actions/chapterActions";
import { ChapterCardProps } from "@/app/interface/chapter";
import ChapterCard from "@/app/ui/user/chapter/chapterCard";
interface PageProps {
  searchParams: Promise<{ page: number }>;
}
export default async function ChapterPage({ searchParams }: PageProps) {
  const currentPage = (await searchParams).page;
  const [chapters, totalPages] = await Promise.all([
    fetchNewestChapterAction(currentPage),
    fetchTotalChapterPageAction(),
  ]);
  console.log("check chapters", chapters);

  return (
    <div className="w=full">
      <span className="font-bold text-2xl text-start whitespace-nowrap">
        Newest Chapter
      </span>

      <div className="grid grid-cols-2 gap-4 mt-5 w-full">
        {chapters && chapters.length > 0
          ? (chapters as ChapterCardProps[]).map(
              (chapter: ChapterCardProps) => (
                <ChapterCard ChapterId={chapter.id} key={chapter.id} />
              )
            )
          : ""}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
