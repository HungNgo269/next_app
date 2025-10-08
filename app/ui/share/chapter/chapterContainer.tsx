"use client";

import { Chapter } from "@/app/interface/chapter";
import { isNewChapter } from "@/lib/utils/chapterUtils";
import { formatDateTimeUTC } from "@/lib/utils/formatDate";
import { requireSubscription } from "@/lib/utils/stripe/subcriptionCheck";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";

interface ChapterContainerProps {
  title: string;
  sub: boolean;
  isCompleted?: boolean;
  // coverImage: string;
  chapters: Chapter[];
  totalChapters?: number;
  showMoreText?: string;
  initialVisibleChapters?: number;
}

export function ChapterContainer({
  title,
  sub,
  chapters,
  totalChapters,
  showMoreText = "Show more",
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
    <div className="flex flex-row items-center justify-start space-x-3 mb-3 gap-4 w-full">
      <div className="h-full flex flex-col items-start w-full">
        <div className="rounded-lg p-4 bg-card shadow-sm w-full">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-foreground">
              Chapters List
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
                      <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
                        <Link
                          prefetch={true}
                          href={`${pathName}/chapter/${chapter.id}`}
                          className="text-primary hover:text-primary/80 hover:underline text-sm truncate"
                        >
                          Chapter {chapter.chapter_number}
                          {chapter.title ? `: ${chapter.title}` : ""}
                        </Link>
                        {isNewChapter(chapter.created_at) && !sub && (
                          <Lock className="w-5 h-5 text-yellow-500"></Lock>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
                        {formatDateTimeUTC(chapter.created_at)}
                      </span>
                    </div>
                  ))}
                </div>

                {!showAll && hasMoreChapters && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary-foreground  to-transparent pointer-events-none" />
                )}
              </div>

              {hasMoreChapters && (
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium hover:cursor-pointer"
                  >
                    {showAll
                      ? "Show less"
                      : `${showMoreText} ${
                          totalChapters
                            ? `(${totalChapters} chapters)`
                            : `(${chapters.length} chapters)`
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
