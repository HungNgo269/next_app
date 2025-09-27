import type { Metadata } from "next";
import { Star, BookOpen, MessageCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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
  const { bookId } = await params;
  const [bookData, bookCategories, chapters] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchCategoryOfBookAction(bookId),
    fetchChapterOfBookAction(bookId),
  ]);
  const book = bookData[0] as Book;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50
     dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 "
    >
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        <Image
          src={book.image_urls[0] || "/placeholder.svg"}
          alt={book.name}
          fill
          className="object-cover blur-xs"
        />
        <div className="absolute inset-0  bg-opacity-40">
          <div className="container mx-auto px-4 sm:px-6 h-full flex items-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 max-w-6xl w-full pt-4 sm:pt-8 md:pt-12">
              <div className="relative w-32 h-44 sm:w-36 sm:h-52 md:w-44 md:h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
                <ImageCard
                  bookImage={book.image_urls[0]}
                  bookName={book.name}
                />
              </div>

              <div className="flex-1 text- space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left  text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight ">
                  {book.name}
                </h1>
                <p className="text-lg sm:text-xl font-medium">{book.author}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                  {bookCategories.map((category) => (
                    <Link
                      key={category.category_id}
                      prefetch={true}
                      href={`${category.url}&page=1`}
                    >
                      <Badge className="bg-info hover:bg-info/90 text-info-foreground px-2 py-1 sm:px-3 text-xs sm:text-sm">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span>{book.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <span className="font-medium text-secondary-foreground">
                    Author:
                  </span>
                  <span className="sm:ml-2 text-secondary-foreground">
                    {book.author}
                  </span>
                </div>
             
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="font-medium text-secondary-foreground">
                  Status:
                </span>
                <span className="sm:ml-2 text-secondary-foreground">
                  {book.is_active ? "Completed" : "Ongoing"}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-secondary-foreground">
              Description
            </h3>
            <BookDesc content={book?.description}></BookDesc>

            <ChapterContainer
              title={book.name}
              chapters={chapters as Chapter[]}
              totalChapters={chapters.length}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              Translator
            </div>
            <div className="font-medium text-gray-900 mb-3">
              Translation Team
            </div>
            <p className="text-sm text-gray-600">
              Professional translation team dedicated to bringing you quality
              content.
            </p>
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}
