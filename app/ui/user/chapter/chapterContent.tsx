// // cant find the way apply bookmark when render with server yet
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
import { useCallback, useEffect, useRef, useState } from "react";

interface ChapterContentProps {
  userId: string;
  chapter: Chapter;
  settings: ReaderSettings;
  bookId: number;
  idNextChapter: number;
  idPrevChapter: number;
}

export default function ChapterContent({
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
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [bookMark, setBookMark] = useState<IBookmark | null>();
  const maxProgress = useRef(0);
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const scrollAnchorsRef = useRef<HTMLDivElement[]>([]);

  // Tạo anchor
  const createScrollAnchors = useCallback(() => {
    if (!chapterRef.current) return;

    // Xóa
    scrollAnchorsRef.current.forEach((anchor) => {
      if (anchor.parentNode) {
        anchor.parentNode.removeChild(anchor);
      }
    });
    scrollAnchorsRef.current = [];

    const chapter = chapterRef.current;
    const chapterHeight = chapter.scrollHeight;

    for (let i = 0; i <= 100; i++) {
      const anchor = document.createElement("div");
      anchor.style.position = "absolute";
      anchor.style.height = "1px";
      anchor.style.width = "100%";
      anchor.style.top = `${(i / 100) * chapterHeight}px`;
      anchor.style.left = "0";
      anchor.style.opacity = "0";
      anchor.style.pointerEvents = "none";
      anchor.dataset.progress = i.toString(); //0=>100

      chapter.appendChild(anchor);
      scrollAnchorsRef.current.push(anchor);
    }
  }, []);
  useEffect(() => {
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
  useEffect(() => {
    createScrollAnchors();
    console.log("first", bookMark);
    if (bookMark) {
      scrollToProgress(bookMark.progress);
    }
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;
            const progress = parseInt(target.dataset.progress ?? "0", 10);
            maxProgress.current = Math.max(maxProgress.current, progress);
          }
        });

        if (maxProgress.current > 0) {
          setCurrentProgress(maxProgress.current);
          if (typeof window !== "undefined") {
            window.history.replaceState(
              null,
              "",
              `#progress-${maxProgress.current}`
            );
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -80% 0px", // Trigger when element is 20% from top
        threshold: 0,
      }
    );

    // Observe all Anchors
    const currentAnchors = scrollAnchorsRef.current;
    currentAnchors.forEach((anchor) => observer.observe(anchor));
    return () => {
      observer.disconnect();
      currentAnchors.forEach((anchor) => {
        if (anchor.parentNode) {
          anchor.parentNode.removeChild(anchor);
        }
      });
    };
  }, [createScrollAnchors, bookMark]);

  const addBookmark = async () => {
    const newBookmark = await addBookMarkAction(
      userId,
      chapter.id,
      currentProgress
    );
    setBookMark(newBookmark);
  };

  const removeBookmark = async () => {
    await removeBookMarkAction(userId, chapter.id);
    setBookMark(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <article className={`max-w-4xl mx-auto px-4 py-8`} style={contentStyle}>
        <div
          ref={chapterRef}
          className="prose prose-lg max-w-none leading-relaxed text-justify relative"
          style={{ position: "relative" }}
        >
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
