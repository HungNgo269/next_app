import { sql } from "@/lib/db";
import { Book } from "@/app/interface/book";
import ChapterCard from "@/app/ui/user/chapter/chapterCard";
import { Chapter } from "@/app/interface/chapter";
import ViewMoreBookButton from "@/app/ui/user/books/viewMoreBookButton";

export default async function NewChapterList() {
  const Chapters = (await sql`
  SELECT DISTINCT ON (Book_id) *
  FROM chapters 
  ORDER BY Book_id, created_at DESC
  LIMIT 6
`) as unknown as Chapter[];
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <span className="font-bold text-2xl text-start flex-1 min-w-0 truncate">
          New Chapter
        </span>
        <ViewMoreBookButton
          context="chapter"
          url="/chapter?page=1"
        ></ViewMoreBookButton>
      </div>
      <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
        {Chapters.map((Chapter: Chapter) => (
          <ChapterCard key={Chapter.id} ChapterId={Chapter.id} />
        ))}
      </div>
    </div>
  );
}
