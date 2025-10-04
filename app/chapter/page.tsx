import type { Metadata } from "next";
import Pagination from "@/app/ui/share/pagination/pagination";
import { fetchTotalChapterPageAction } from "@/app/actions/chapterActions";
import ChapterList from "./chapterlist";
import { Suspense } from "react";
import { BookCardSkeleton } from "../ui/skeletons";
import { getURL } from "@/lib/utils/helper";
const CHAPTER_PAGE_TITLE = "Latest Chapter Updates | NextBook";
const CHAPTER_PAGE_DESCRIPTION =
  "Stay caught up with the newest chapters released across the NextBook library.";
const CHAPTER_PAGE_URL = getURL("chapter");
const CHAPTER_PAGE_IMAGE = getURL("hero-desktop.png");

export const metadata: Metadata = {
  title: { absolute: CHAPTER_PAGE_TITLE },
  description: CHAPTER_PAGE_DESCRIPTION,
  keywords: [
    "NextBook chapters",
    "latest updates",
    "web novel releases",
    "chapter updates",
    "online fiction",
  ],
  alternates: {
    canonical: CHAPTER_PAGE_URL,
  },
  openGraph: {
    url: CHAPTER_PAGE_URL,
    title: CHAPTER_PAGE_TITLE,
    description: CHAPTER_PAGE_DESCRIPTION,
    type: "website",
    images: [
      {
        url: CHAPTER_PAGE_IMAGE,
        width: 1200,
        height: 630,
        alt: "Read the newest chapters on NextBook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CHAPTER_PAGE_TITLE,
    description: CHAPTER_PAGE_DESCRIPTION,
    images: [CHAPTER_PAGE_IMAGE],
  },
  robots: { index: true, follow: true },
};

interface PageProps {
  searchParams: Promise<{ page: string }>;
}
export default async function ChapterPage({ searchParams }: PageProps) {
  const page = (await searchParams).page;
  const currentPage = Number(page) || 1;
  const [totalPages] = await Promise.all([fetchTotalChapterPageAction()]);
  return (
    <div className="w-full">
      <span className="font-bold text-2xl text-start whitespace-nowrap">
        Newest Chapter
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 w-full mx-auto">
        <Suspense fallback={<BookCardSkeleton></BookCardSkeleton>}>
          <ChapterList currentPage={currentPage}></ChapterList>
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center ">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
