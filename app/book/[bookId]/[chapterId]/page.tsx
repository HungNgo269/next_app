import { Chapter } from "@/app/interface/chapter";
import fetchChapter from "./data";
import { getChapterStats } from "./action";
import ViewIncrementer from "./viewIncrement";

type PageProps = {
  params: Promise<{
    chapterId: string;
  }>;
};

export default async function ChapterPage({ params }: PageProps) {
  const { chapterId } = await params;

  const [chapter, stats] = await Promise.all([
    fetchChapter(chapterId),
    getChapterStats(chapterId),
  ]);
  const chapter1: Chapter = chapter;
  return (
    <div className="flex flex-col w-[220px] h-[445px] p-1 mt-10">
      <div className="flex flex-col h-fit w-full mt-2.5">
        <span className="line-clamp-2 font-bold w-full">{chapter1.title}</span>

        <div className="mt-2 text-sm text-gray-600">
          <p>Total Views: {stats.totalViews}</p>
          <p>Today Views: {stats.todayViews}</p>
          <p>Unique Views: {stats.uniqueViews}</p>
        </div>
      </div>

      {/* Component để increment view */}
      <ViewIncrementer chapterId={chapterId} />
    </div>
  );
}
