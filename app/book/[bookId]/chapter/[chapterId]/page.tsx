import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "@/app/interface/book";
import { Chapter } from "@/app/interface/chapter";
import { fetchBookByIdActions } from "@/app/actions/bookActions";
import ViewIncrementer from "@/app/book/[bookId]/chapter/[chapterId]/viewIncrement";
import {
  checkNextChapterAction,
  checkPrevChapterAction,
  fetchChapterActions,
} from "@/app/book/[bookId]/chapter/[chapterId]/action";
import { getSessionCache } from "@/lib/utils/getSession";
import Link from "next/link";
import { getURL } from "@/lib/utils/helper";
import ChapterSubWrapper from "@/app/ui/user/chapter/chapterSubWrapper";

const FALLBACK_CHAPTER_OG_IMAGE = getURL("hero-desktop.png");

const resolveImageUrl = (value?: string) => {
  if (!value) return undefined;
  return value.startsWith("http") ? value : getURL(value);
};

const toChapterSummary = (value?: string | null) => {
  if (!value) return undefined;
  const plain = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return undefined;
  return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
};

type PageProps = {
  params: Promise<{
    chapterId: number;
    bookId: number;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps["params"];
}): Promise<Metadata> {
  const { chapterId, bookId } = await params;
  try {
    const [chapterData, bookRows] = await Promise.all([
      fetchChapterActions(chapterId),
      fetchBookByIdActions(bookId),
    ]);

    const chapter = chapterData as Chapter | undefined;
    const book = bookRows?.[0] as Book | undefined;

    if (!chapter) {
      return {
        title: { absolute: "Chapter Not Found | NextBook" },
        description: "The chapter you were looking for could not be found.",
        robots: { index: false, follow: false },
      };
    }

    const canonicalPath = `book/${bookId}/chapter/${chapterId}`;
    const titleBase = book
      ? `${book.name} - Chapter ${chapter.chapter_number}: ${chapter.title}`
      : `Chapter ${chapter.chapter_number}: ${chapter.title}`;
    const description =
      toChapterSummary(chapter.content) ??
      (book
        ? `Read chapter ${chapter.chapter_number} of ${book.name} on NextBook.`
        : `Read chapter ${chapter.chapter_number} on NextBook.`);
    const imageUrl = book
      ? resolveImageUrl(
          Array.isArray(book.image_urls) ? book.image_urls[0] : undefined
        )
      : undefined;
    const resolvedImage = imageUrl ?? FALLBACK_CHAPTER_OG_IMAGE;
    const canonicalUrl = getURL(canonicalPath);
    const keywords = [
      book?.name,
      chapter.title,
      `Chapter ${chapter.chapter_number}`,
      book?.author,
      "NextBook",
      "novel chapter",
    ].filter(Boolean) as string[];

    return {
      title: { absolute: `${titleBase} | NextBook` },
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: `${titleBase} | NextBook`,
        description,
        images: resolvedImage
          ? [
              {
                url: resolvedImage,
                width: 1200,
                height: 630,
                alt: book ? `Artwork for ${book.name}` : "Read on NextBook",
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${titleBase} | NextBook`,
        description,
        images: resolvedImage ? [resolvedImage] : undefined,
      },
      robots: { index: true, follow: true },
    };
  } catch (_error) {
    return {
      title: { absolute: "Read Chapters | NextBook" },
      description: "Enjoy serialized fiction on NextBook.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const session = await getSessionCache();
  const user = session?.user;
  const { chapterId, bookId } = await params;
  const [chapterData] = await Promise.all([fetchChapterActions(chapterId)]);
  const chapter: Chapter = chapterData as Chapter;
  const [idPrevChapter, idNextChapter] = await Promise.all([
    checkPrevChapterAction(chapter.chapter_number, bookId),
    checkNextChapterAction(chapter.chapter_number, bookId),
  ]);

  return (
    <div className="h-screen bg-background relative">
      <ViewIncrementer
        userId={user?.id}
        chapterId={chapterId}
        bookId={bookId}
      />
      <div className="max-w-full h-screen">
        <ChapterSubWrapper
          userId={user?.id ?? ""}
          bookId={bookId}
          chapter={chapter}
          idPrevChapter={idPrevChapter}
          idNextChapter={idNextChapter}
        ></ChapterSubWrapper>
      </div>
    </div>
  );
}
