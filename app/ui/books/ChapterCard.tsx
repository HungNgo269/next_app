import { Chapter } from "@/app/interface/chapter";
import { BookImage } from "@/app/interface/book";
import { sql } from "@/app/lib/db";
import ImageCard from "../image/imageCard";
import { fetchChapterCardAction } from "@/app/actions/chapterActions";
import { fetchBookImageForChapterAction } from "@/app/actions/bookActions";
import Link from "next/link";

interface PageProps {
  ChapterId: string;
}

export default async function ChapterCard({ ChapterId }: PageProps) {
  const Chapters: Chapter[] = await fetchChapterCardAction(ChapterId);
  const chapter = Chapters[0];
  console.log(chapter);
  const Books: BookImage[] = await fetchBookImageForChapterAction(
    chapter.book_id
  );
  const book = Books[0];

  return (
    <div className="flex flex-row h-[190px]">
      <Link
        className="relative min-w-[130px] h-[190px] group overflow-hidden rounded-[8px]"
        href={`book/${book.id}/${chapter.id}`}
      >
        <ImageCard
          bookImage={book.image_urls[0]}
          bookName={book.name}
          key={book.id}
        />
      </Link>

      <div className="flex flex-col h-fit w-fit mt-1 pl-6">
        <Link
          href={`book/${book.id}/${chapter.id}`}
          className="line-clamp-1  font-bold w-full"
        >
          {book.name}
        </Link>
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
