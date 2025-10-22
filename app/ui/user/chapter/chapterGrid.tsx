import ChapterCard from "@/app/ui/user/chapter/chapterCard";
import { BookNewChapterCard } from "@/app/interface/chapter";
import { fetchNewestChapterAction } from "@/app/actions/chapterActions";

interface Props {
  page: number;
}

export default async function ChapterGrid({ page }: Props) {
  const Books = await fetchNewestChapterAction(page);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full">
      {Books?.map((Books:BookNewChapterCard) => (
        <ChapterCard key={Books.book_id} Books={Books} />
      ))}
    </div>
  );
}
