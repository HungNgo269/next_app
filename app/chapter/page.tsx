import MostPopularBook from "@/app/ui/user/ranking/popularBook";

import Pagination from "@/app/ui/share/pagination/pagination";
import FooterComponent from "@/app/ui/user/footer/footerComponent";
import {
  fetchNewestChapterAction,
  fetchTotalChapterPageAction,
} from "@/app/actions/chapterActions";
import { ChapterCardProps } from "@/app/interface/chapter";
import ChapterCard from "@/app/ui/user/chapter/chapterCard";

export default async function ChapterPage() {
  const [chapters, totalPages] = await Promise.all([
    fetchNewestChapterAction(),
    fetchTotalChapterPageAction(),
  ]);

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
