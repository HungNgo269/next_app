import ChapterCard from "@/app/ui/user/chapter/chapterCard";
import { ChapterCardProps } from "@/app/interface/chapter";
import { fetchNewestChapterAction } from "@/app/actions/chapterActions";

interface Props {
  page: number;
}

export default async function ChapterGrid({ page }: Props) {
  const Chapters = await fetchNewestChapterAction(page);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full">
      {Chapters?.map((Chapter: ChapterCardProps) => (
        <ChapterCard key={Chapter.id} ChapterId={Chapter.id} />
      ))}
    </div>
  );
}
