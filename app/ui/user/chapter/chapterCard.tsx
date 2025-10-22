import { BookNewChapterCard, ChapterCardProps } from "@/app/interface/chapter";
import {  fetchMultipleChapterCardAction } from "@/app/actions/chapterActions";
import Link from "next/link";
import ImageCard from "@/app/ui/share/image/imageCard";
import {
  fetchBookImageAction,
  fetchBookSideInfoAction,
} from "@/app/actions/bookActions";
import {  formatRelativeTime } from "@/lib/utils/formatDate";
import {
  GetBookFollowerCountAction,
} from "@/app/actions/bookFollowActions";
import { Bookmark,  LucideEye, Star } from "lucide-react";

interface props{
   Books: BookNewChapterCard
}

export default async function ChapterCard({ Books }: props) {
   const chaptersId: number[] =[]
  Books.chapters.map((chapter)=>{
    chaptersId.push(chapter.id)
  })
  const chapters =await fetchMultipleChapterCardAction(chaptersId)
  const [book, bookInfo, bookFollow] = await Promise.all([
    fetchBookImageAction(chapters[0].book_id!),
    fetchBookSideInfoAction(chapters[0].book_id!),
    GetBookFollowerCountAction(chapters[0].book_id!),
  ]);

  return (
    <div className="flex flex-col w-full group">
      <Link
        prefetch={true}
        className="relative w-full aspect-[2/3] group overflow-hidden rounded-[8px]"
        href={`book/${book.id}`}
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
          <p className="text-white font-bold line-clamp-4">{book.name}</p>
        </div>
      </Link>

      <div className="flex flex-col mt-2 ">
          {chapters.map((chapter:ChapterCardProps)=>(
        <div className="flex flex-row justify-between items-center" key={chapter.id}>
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
          ))}
   
      </div>
    </div>
  );
}
