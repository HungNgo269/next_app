import { Chapter } from "@/app/interface/chapter";
import { BookImage } from "@/app/interface/book";
import { sql } from "@/app/lib/db";
import ImageCard from "../image/imageCard";

interface PageProps {
  ChapterId: string;
}

export default async function ChapterCard({ ChapterId }: PageProps) {
  const id = ChapterId;
  const Chapters: Chapter[] = await sql`
    SELECT id,book_id, title, chapter_number, is_free
    FROM chapters
    WHERE id = ${id}
  `;
  const chapter = Chapters[0];
  const Books: BookImage[] = await sql`
    SELECT image_urls,description,name
    FROM Books
    WHERE id = ${chapter.book_id}
  `;
  const book = Books[0];

  return (
    <div className="flex flex-row h-[190px]">
      <div className="relative min-w-[130px] h-[190px] group overflow-hidden rounded-[8px]">
        <ImageCard
          bookImage={book.image_urls[0]}
          bookName={book.name}
          key={book.id}
        />
      </div>

      <div className="flex flex-col h-fit w-fit mt-1 pl-6">
        <span className="line-clamp-1  font-bold w-full">{book.name}</span>
        <div className="line-clamp-2">
          <span className=" font-medium ">
            Chapter {chapter.chapter_number}
          </span>
        </div>
        <span className="line-clamp-3 w-full mt-2">{book.description}</span>
      </div>
    </div>
  );
}
