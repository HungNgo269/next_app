"use client";

import { Chapter } from "@/app/interface/chapter";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ChapterContainerProps {
  title: string;
  isCompleted?: boolean;
  // coverImage: string;
  chapters: Chapter[];
  totalChapters?: number;
  showMoreText?: string;
  initialVisibleChapters?: number;
}

export function ChapterContainer({
  title,
  chapters,
  totalChapters,
  showMoreText = "Xem tiếp",
  initialVisibleChapters = 5,
}: ChapterContainerProps) {
  const [showAll, setShowAll] = useState(false);
  console.log(chapters);
  const visibleChapters = showAll
    ? chapters
    : chapters.slice(0, initialVisibleChapters);
  const hasMoreChapters = chapters.length > initialVisibleChapters;
  const pathName = usePathname();
  return (
    <div className="flex flex-row items-center justify-start space-x-3 mb-3 gap-4">
      {/* <div>
        <Image
          src={v}
          alt="book cover"
          width={0}
          height={0}
          sizes="125px"
          style={{
            width: "125px",
            height: "auto",
            borderRadius: "10px",
          }}
        />
      </div> */}
      <div className="h-full flex flex-col items-start w-full">
        <div className="rounded-lg p-4 bg-card shadow-sm w-full">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {title}
              <span className="text-destructive">*</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="space-y-2">
                  {visibleChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* {isNewChapter(chapter.createdAt, 7) && (
                      <span className="text-destructive text-sm font-medium flex-shrink-0">
                        Mới
                      </span>
                    )} */}
                        <Link
                          prefetch={true}
                          href={`${pathName}/chapter/${chapter.id}`}
                          className="text-primary hover:text-primary/80 hover:underline text-sm truncate"
                        >
                          {chapter.title}
                        </Link>
                      </div>
                      <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
                        {chapter.createdAt}
                      </span>
                    </div>
                  ))}
                </div>

                {!showAll && hasMoreChapters && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                )}
              </div>

              {hasMoreChapters && (
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium"
                  >
                    {showAll
                      ? "Thu gọn"
                      : `${showMoreText} ${
                          totalChapters
                            ? `(${totalChapters} chương)`
                            : `(${chapters.length} chương)`
                        }`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
