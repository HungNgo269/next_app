"use client";

import { Chapter } from "@/app/interface/chapter";
import { isNewChapter } from "@/lib/utils/chapterUtils";
import Image from "next/image";
import { useState } from "react";

interface ChapterContainerProps {
  title: string;
  isCompleted?: boolean;
  coverImage: string;
  chapters: Chapter[];
  totalChapters?: number;
  showMoreText?: string;
  initialVisibleChapters?: number;
}

export function ChapterContainer({
  title,
  isCompleted = false,
  coverImage,
  chapters,
  totalChapters,
  showMoreText = "Xem tiếp",
  initialVisibleChapters = 5,
}: ChapterContainerProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleChapters = showAll
    ? chapters
    : chapters.slice(0, initialVisibleChapters);
  const hasMoreChapters = chapters.length > initialVisibleChapters;
  console.log(visibleChapters);
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {title} <span className="text-red-500">*</span>
        </h2>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={title}
            width={120}
            height={160}
            className="rounded border border-gray-300"
          />
        </div>

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
                      <span className="text-red-500 text-sm font-medium flex-shrink-0">
                        Mới
                      </span>
                    )} */}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate"
                    >
                      {chapter.title}
                    </a>
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
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
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
    </div>
  );
}
