import { sql } from "@/app/lib/db";
import BookCard from "./bookCard";
import { Book } from "@/app/interface/book";
import ChapterCard from "./chapterCard";
import { Chapter } from "@/app/interface/chapter";

export default async function NewChapterList() {
  const Chapters: Chapter[] = await sql`
  SELECT DISTINCT ON (Book_id) *
  FROM chapters 
  ORDER BY Book_id, created_at DESC
  LIMIT 6
`;
  return (
    <div className="flex flex-col justify-center items-center ">
      <span className="font-bold text-2xl w-full text-start">New Chapter</span>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {Chapters.map((Chapter: Chapter) => (
          <ChapterCard key={Chapter.id} ChapterId={Chapter.id} />
        ))}
      </div>
    </div>
  );
}
