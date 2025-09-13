import { Star, BookOpen, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

type PageProps = {
  params: Promise<{
    bookId: number;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { bookId } = await params;
  const [bookData, bookCategories, chapters] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchCategoryOfBookAction(bookId),
    fetchChapterOfBookAction(bookId),
  ]);
  const book = bookData[0] as unknown as Book;

  return (
    <div className="min-h-screen bg-gray-100">
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

              <div className="flex-1 text-white space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                  {book.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 font-medium">
                  {book.author}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                  {bookCategories.map((category) => (
                    <Link
                      key={category.category_id}
                      prefetch={true}
                      href={category.url}
                    >
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 text-xs sm:text-sm">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
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
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Author:</span>
                    <span className="sm:ml-2 text-gray-900">{book.author}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="sm:ml-2 text-gray-900">
                      {book.is_active ? "Completed" : "Ongoing"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {book.description}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <ChapterContainer
                  title={book.name}
                  chapters={chapters as Chapter[]}
                  totalChapters={chapters.length}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  Translator
                </div>
                <div className="font-medium text-gray-900 mb-3">
                  Translation Team
                </div>
                <p className="text-sm text-gray-600">
                  Professional translation team dedicated to bringing you
                  quality content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}
