// cant find the way apply bookmark when render with server yet
"use client";
import {
  addBookMarkAction,
  getBookMarkAction,
  removeBookMarkAction,
} from "@/app/actions/bookMarkActions";
import { IBookmark } from "@/app/interface/bookMark";
import { Chapter } from "@/app/interface/chapter";
import ChapterToolBar from "@/app/ui/user/chapter/chapterToolBar";
import { ReaderSettings } from "@/lib/readerSetting";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ChapterContentProps {
  userId: string;
  chapter: Chapter;
  settings: ReaderSettings;
  bookId: number;
  idNextChapter: number;
  idPrevChapter: number;
}

function ChapterContent({
  userId,
  chapter,
  settings,
  bookId,
  idNextChapter,
  idPrevChapter,
}: ChapterContentProps) {
  const contentStyle: React.CSSProperties = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
  };
  const [bookMark, setBookMark] = useState<IBookmark | null>();
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathName = usePathname();
  const progressRef = useRef<number>(0); // Lưu progress mà không rerender
  const updateProgress = useCallback(() => {
    if (!chapterRef.current) return 0;
    const { scrollHeight, offsetTop } = chapterRef.current; //
    const scrollY = window.scrollY; //vùng đã scroll
    const viewportHeight = window.innerHeight; //vùng chiều cao người dùng có thể quan sát (viewport)
    const contentHeight = scrollHeight - viewportHeight;
    if (contentHeight <= 0) return 100;
    const progress = Math.min(
      100,
      Math.max(0, ((scrollY - offsetTop) / contentHeight) * 100)
    );
    progressRef.current = Math.floor(progress);
    return progressRef.current;
  }, []);

  useEffect(() => {
    const loadAndSetup = async () => {
      if (userId) {
        const res = await getBookMarkAction(userId, chapter.id);
        setBookMark(res || null);
        if (res) {
          scrollToProgress(res.progress);
          progressRef.current = res.progress;
        }
      }
      const handleScroll = () => {
        updateProgress();
      };
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", updateProgress);
      updateProgress();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", updateProgress);
      };
    };
    loadAndSetup();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const getBookMark = async () => {
      const res = (await getBookMarkAction(userId, chapter.id)) || null;
      if (res) {
        setBookMark(res);
      }
    };
    getBookMark();
  }, []);

  const scrollToProgress = (targetProgress: number): void => {
    if (!chapterRef.current) return;

    const { scrollHeight, offsetTop } = chapterRef.current;
    const viewportHeight = window.innerHeight;
    const contentHeight = scrollHeight - viewportHeight;

    if (contentHeight <= 0) {
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      return;
    }
    const scrollPosition = offsetTop + (targetProgress / 100) * contentHeight;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  const addBookmark = async () => {
    if (!userId) {
      return;
    }
    updateProgress();
    const newBookmark = await addBookMarkAction(
      userId,
      chapter.id,
      progressRef.current
    );
    setBookMark(newBookmark);
  };
  const removeBookmark = async () => {
    await removeBookMarkAction(userId, chapter.id);
    setBookMark(null);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && idPrevChapter) {
        const baseUrl = pathName.split("/").slice(0, -1).join("/");
        router.push(`${baseUrl}/${idPrevChapter}`);
      }
      if (event.key === "ArrowRight" && idNextChapter) {
        const baseUrl = pathName.split("/").slice(0, -1).join("/");
        router.push(`${baseUrl}/${idNextChapter}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen bg-background relative pt-8" ref={chapterRef}>
      <div className="flex flex-col gap-3 w-full">
        <article className={`max-w-4xl mx-auto px-4`} style={contentStyle}>
          <div
            className="prose prose-lg max-w-none leading-relaxed text-justify relative flex flex-col gap-7"
            style={{ position: "relative" }}
          >
            <div className="flex flex-row items-center justify-center text-2xl ">
              <span>
                Chapter {`${chapter.chapter_number}`}{" "}
                {chapter.title.length > 0 ? `: ${chapter.title}` : ""}
              </span>
            </div>
            <div
              className="prose prose-lg max-w-none leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>
        </article>
        <div className="max-w-4xl w-full mx-auto px-4 hidden lg:block">
          <div className="flex justify-between items-center mb-12 pt-8 border-t">
            {idPrevChapter ? (
              <Link
                className="flex flex-row items-center gap-2"
                href={`/book/${bookId}/chapter/${idPrevChapter}`}
                aria-disabled={idPrevChapter === null}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </Link>
            ) : (
              <Link
                className="flex flex-row items-center gap-2"
                href={`/book/${bookId}`}
              >
                <ChevronLeft className="w-4 h-4" />
                Home
              </Link>
            )}
            {idNextChapter ? (
              <Link
                className="flex flex-row items-center gap-2"
                href={`/book/${bookId}/chapter/${idNextChapter}`}
                aria-disabled={idNextChapter == null}
              >
                Next Chapter
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                className="flex flex-row items-center gap-2"
                href={`/book/${bookId}`}
              >
                Home
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <ChapterToolBar
        iniSettings={settings}
        bookId={bookId}
        idPrev={idPrevChapter}
        idNext={idNextChapter}
        bookMarkOnClick={bookMark ? removeBookmark : addBookmark}
        bookMark={bookMark}
      />
    </div>
  );
}
export default React.memo(ChapterContent);
