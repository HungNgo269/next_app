import { Chapter } from "@/app/interface/chapter";
import { BookImage } from "@/app/interface/book";
import { fetchChapterCardAction } from "@/app/actions/chapterActions";
import Link from "next/link";
import ImageCard from "../../share/image/imageCard";
import { fetchBookImageAction } from "@/app/actions/bookActions";

interface PageProps {
  ChapterId: string;
}

export default async function ChapterCard({ ChapterId }: PageProps) {
  const chapter: Chapter = await fetchChapterCardAction(ChapterId);
  const book: BookImage = await fetchBookImageAction(chapter.book_id);

  return (
    <div className="flex flex-row h-[190px]">
      <Link
        className="relative min-w-[130px] h-[190px] group overflow-hidden rounded-[8px]"
        href={`book/${book.id}/chapter/${chapter.id}`}
      >
        <ImageCard
          bookImage={book.image_urls[0]}
          bookName={book.name}
          key={book.id}
        />
      </Link>

      <div className="flex flex-col h-fit w-fit mt-1 pl-6">
        <Link
          href={`book/${book.id}`}
          className="line-clamp-1  font-bold w-full hover:underline"
        >
          {book.name}
        </Link>
        <div className="line-clamp-2">
          <Link
            href={`book/${book.id}/chapter/${chapter.id}`}
            className="line-clamp-1  font-medium w-full hover:underline"
          >
            Chapter {chapter.chapter_number}
          </Link>
        </div>
        <span className="line-clamp-3 w-full mt-2">{book.description}</span>
      </div>
    </div>
  );
}
