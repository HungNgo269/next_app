import type { Metadata } from "next";
import {
  Star,
  BookOpen,
  MessageCircle,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { fetchBookByIdActions } from "@/app/actions/bookActions";
import { fetchCategoryOfBookAction } from "@/app/actions/categoryActions";
import Link from "next/link";
import { ChapterContainer } from "@/app/ui/share/chapter/chapterContainer";
import { fetchChapterOfBookAction } from "@/app/actions/chapterActions";
import type { Book } from "@/app/interface/book";
import FooterComponent from "@/app/ui/user/footer/footerComponent";
import ImageCard from "@/app/ui/share/image/imageCard";
import type { Chapter } from "@/app/interface/chapter";
import BookDesc from "@/app/ui/user/books/bookDesc";
import { getURL } from "@/lib/utils/helper";
import { getSessionCache } from "@/lib/utils/getSession";
import FollowButton from "@/app/book/[bookId]/followBookButton";

const FALLBACK_BOOK_OG_IMAGE = getURL("hero-desktop.png");
const toAbsoluteImageUrl = (value?: string) => {
  if (!value) return undefined;
  return value.startsWith("http") ? value : getURL(value);
};

const toMetaDescription = (value?: string | null) => {
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
    bookId: number;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: PageProps["params"];
}): Promise<Metadata> {
  const { bookId } = await params;
  try {
    const [bookRows, categories] = await Promise.all([
      fetchBookByIdActions(bookId),
      fetchCategoryOfBookAction(bookId),
    ]);
    const book = bookRows?.[0] as Book | undefined;

    if (!book) {
      return {
        title: { absolute: "Book Not Found | NextBook" },
        description: "The book you were looking for could not be found.",
        robots: { index: false, follow: false },
      };
    }

    const canonicalPath = `book/${bookId}`;
    const description =
      toMetaDescription(book.description) ?? `Read ${book.name} on NextBook.`;
    const imageUrl =
      toAbsoluteImageUrl(book.image_urls?.[0]) ?? FALLBACK_BOOK_OG_IMAGE;
    const categoryKeywords = Array.isArray(categories)
      ? (categories
          .map((category: { name?: string }) => category?.name)
          .filter(Boolean) as string[])
      : [];
    const title = `${book.name}${
      book.author ? ` by ${book.author}` : ""
    } | NextBook`;
    const keywords = [
      book.name,
      book.author,
      ...categoryKeywords,
      "NextBook",
      "online novels",
    ].filter(Boolean) as string[];
    const canonicalUrl = getURL(canonicalPath);

    return {
      title: { absolute: title },
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "book",
        url: canonicalUrl,
        title,
        description,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `Cover art for ${book.name}`,
              },
            ]
          : undefined,
        authors: book.author ? [book.author] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
      robots: { index: true, follow: true },
    };
  } catch (_error) {
    return {
      title: { absolute: "Book Details | NextBook" },
      description: "Explore immersive stories on NextBook.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BookPage({ params }: PageProps) {
  const session = await getSessionCache();
  const user = session?.user;
  const { bookId } = await params;
  const [bookData, bookCategories, chapters] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchCategoryOfBookAction(bookId),
    fetchChapterOfBookAction(bookId),
  ]);
  const book = bookData[0] as Book;

  return (
    <div className="min-h-screen relative ">
      <div className="absolute w-full h-[280px] top-0 left-0 -z-10">
        <Image
          src={book.image_urls[0] || "/placeholder.svg"}
          alt={book.name}
          fill
          className="object-cover blur-xs"
        />
        <div className="absolute inset-0 bg-opacity-40 bg-black/30"></div>
      </div>
      <div
        className="h-full 
  grid 
  grid-cols-[minmax(0,100px)_minmax(0,1fr)]
  sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]
  md:grid-cols-[200px_1fr]  
  lg:grid-cols-[200px_1fr] 
  xl:grid-cols-[200px_1fr]  
  max-w-[688px]            
  md:max-w-[944px]        
  lg:max-w-[1400px]        
  grid-rows-[minmax(0,74px)_minmax(0,48px)_minmax(0,60px)_minmax(0,40px)_minmax(0,auto)]
  md:grid-rows-[minmax(0,216px)_minmax(0,48px)_minmax(0,24px)_minmax(0,24px)_minmax(0,auto)]
  gap-4 
  items-start 
  pt-15 
  w-full
  mx-auto px-4"
      >
        <div className="relative w-full h-[142px] md:h-[284px] row-span-2 col-span-1   rounded-lg overflow-hidden shadow-xl">
          <ImageCard bookImage={book.image_urls[0]} bookName={book.name} />
        </div>
        <div className="flex flex-col justify-between text-white row-span-1 col-start-2 col-span-1 h-full  ml-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            {book.name}
          </h1>
          <p className="text-lg sm:text-xl font-medium">{book.author}</p>
        </div>
        <div className="row-span-1 col-span-2 md:col-span-1 col-start-1 md:col-start-2 row-start-4 md:row-start-2  h-full ml-2 flex flex-row justify-start">
          <FollowButton bookId={bookId} userId={user?.id || ""}></FollowButton>
        </div>
        <div className="row-span-1 col-span-2 col-start-1 md:col-span-1 md:col-start-2 row-start-3 flex flex-wrap  justify-start gap-2 ml-2 items-center">
          {bookCategories.map((category) => (
            <Link
              key={category.category_id}
              prefetch={true}
              href={`${category.url}&page=1`}
            >
              <Badge className="bg-info hover:bg-info/90 text-info-foreground  text-xs sm:text-sm ">
                {category.name}
              </Badge>
            </Link>
          ))}
          <span className="font-medium  text-white md:text-secondary-foreground">
            Status:
          </span>
          <span className="sm:ml-2 text-white md:text-secondary-foreground">
            {book.is_active ? "Completed" : "Ongoing"}
          </span>
        </div>
        <div className="row-span-1 col-span-1 col-start-2 row-start-2 md:row-start-4 gap-4 ml-2 flex  sm:justify-start text-white md:text-accent-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-current" />
            <span>{book.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{book.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-4 h-4" />
            <span>12</span>
          </div>
        </div>
        <div className="row-span-1 col-span-2 md:col-span-1 md:col-start-2 row-start-5 gap-4 ml-2 flex flex-col items-center justify-center sm:justify-start">
          <BookDesc content={book?.description}></BookDesc>

          <ChapterContainer
            title={book.name}
            chapters={chapters as Chapter[]}
            totalChapters={chapters.length}
          />
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}
