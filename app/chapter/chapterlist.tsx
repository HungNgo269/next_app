import { fetchNewestChapterAction } from "../actions/chapterActions";
import { ChapterCardProps } from "../interface/chapter";
import ChapterCard from "../ui/user/chapter/chapterCard";

export default async function ChapterList({
  currentPage,
}: {
  currentPage: number;
}) {
  const chapters = await fetchNewestChapterAction(currentPage);
  return (
    <>
      {chapters && chapters.length > 0
        ? (chapters as ChapterCardProps[]).map((chapter: ChapterCardProps) => (
            <ChapterCard ChapterId={chapter.id} key={chapter.id} />
          ))
        : ""}
    </>
  );
}
