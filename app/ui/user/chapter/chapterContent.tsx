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
  const router= useRouter()
  const pathName = usePathname()
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
    console.log("progres", progressRef.current);
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
    const chapter = chapterRef.current;
    const chapterContentHeight = chapter.scrollHeight;
    const positionScroll = (targetProgress / 100) * chapterContentHeight;
    window.scrollTo({
      top: positionScroll,
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
    <div
      className="min-h-screen bg-background relative mt-8"
      
    >
      <article
        className={`max-w-4xl mx-auto px-4`}
        ref={chapterRef}
        style={contentStyle}
      >
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
