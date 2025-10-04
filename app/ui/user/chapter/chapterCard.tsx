import { Chapter } from "@/app/interface/chapter";
import { BookImage, BookSideInfo } from "@/app/interface/book";
import { fetchChapterCardAction } from "@/app/actions/chapterActions";
import Link from "next/link";
import ImageCard from "@/app/ui/share/image/imageCard";
import {
  fetchBookImageAction,
  fetchBookSideInfoAction,
} from "@/app/actions/bookActions";
import { formatDateTimeUTC, formatRelativeTime } from "@/lib/utils/formatDate";
import {
  GetBookFollowAction,
  GetBookFollowerCountAction,
} from "@/app/actions/bookFollowActions";
import { Bookmark, Eye, LucideEye, Star } from "lucide-react";

interface PageProps {
  ChapterId: number;
}

export default async function ChapterCard({ ChapterId }: PageProps) {
  const chapter = (await fetchChapterCardAction(
    ChapterId
  )) as unknown as Chapter;
  const [book, bookInfo, bookFollow] = await Promise.all([
    fetchBookImageAction(chapter.book_id),
    fetchBookSideInfoAction(chapter.book_id),
    GetBookFollowerCountAction(chapter.book_id),
  ]);

  return (
    <div className="flex flex-col w-full group">
      <Link
        prefetch={true}
        className="relative w-full aspect-[2/3] group overflow-hidden rounded-[8px]"
        href={`book/${book.id}/chapter/${chapter.id}`}
      >
        <ImageCard
          bookImage={book.image_urls[0]}
          bookName={book.name}
          key={book.id}
        />

        <div
          className="absolute bottom-0 left-0 z-[1] h-3/5 w-full bg-gradient-to-t from-neutral-900 from-15%
      to-transparent transition-all duration-500 flex  flex-col-reverse p-1.5 group-hover:h-3/4"
        >
          <div
            className="flex flex-row justify-between items-center text-sm  text-gray-600
          fill-gray-600"
          >
            <div className="flex flex-row gap-1 items-center">
              <Star className="w-3.5 h-3.5 " />
              <span>{bookInfo.rating ?? "0"}</span>
            </div>

            <div className="flex flex-row gap-1 items-center">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookFollow ?? "0"}</span>
            </div>

            <div className="flex flex-row gap-1 items-center ">
              <LucideEye className="w-3.5 h-3.5" />
              <span>{bookInfo.views ?? "0"}</span>
            </div>
          </div>
          <p className="text-primary-foreground font-bold line-clamp-4">
            {book.name}
          </p>
        </div>
      </Link>

      <div className="flex flex-col mt-2 ">
        <div className="flex flex-row justify-between items-center">
          <Link
            prefetch={true}
            href={`book/${book.id}/chapter/${chapter.id}`}
            className="line-clamp-1 font-medium text-sm text-primary hover:underline truncate"
          >
            Chapter {chapter.chapter_number}
          </Link>
          <span className="text-gray-500 text-xs">
            {formatRelativeTime(chapter.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
