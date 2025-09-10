import { Heart, Star, BookOpen, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  fetchBookByIdActions,
  fetchTotalChapterInBookByIdAction,
} from "@/app/actions/bookActions";
import { fetchCategoryOfBookAction } from "@/app/actions/categoryActions";
import Link from "next/link";
import { ChapterContainer } from "@/app/ui/share/chapter/chapterContainer";
import { fetchChapterOfBookAction } from "@/app/actions/chapterActions";
import { Book } from "@/app/interface/book";
import FooterComponent from "@/app/ui/user/footer/footerComponent";
import ImageCard from "@/app/ui/share/image/imageCard";
import { Chapter } from "@/app/interface/chapter";

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
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full h-72 relative">
        <ImageCard bookImage={book.image_urls[0]} bookName="book banner" />
        <div className="absolute inset-0  bg-opacity-40">
          <div className=" mx-auto px-4 h-full flex items-end pb-6">
            <div className="flex items-center gap-6 w-[1200px] mx-auto">
              <div className="relative w-[200px] h-fit flex-shrink-0 mt-12 rounded-md">
                <ImageCard
                  bookImage={book.image_urls[0]}
                  bookName="book banner"
                />
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  {book.name}
                </h1>
                <p className="text-lg md:text-xl text-gray-200">
                  {book.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[1200px] justify-between mt-10 mx-auto">
        <div className="w-[850px]   flex flex-col gap-5">
          <div>
            <div className="flex  flex-wrap gap-2 mb-4">
              {bookCategories.map((category) => (
                <div key={category.category_id}>
                  <Link prefetch={true} href={category.url}>
                    <Badge variant="secondary">{category.name}</Badge>
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Author:</span> {book.author}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                {book.is_active ? "Completed" : "On going"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-6">
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-red-500">
                <Heart className="w-5 h-5" />
                <span className="text-xs">144</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-yellow-500">
                <Star className="w-5 h-5" />
                <span className="text-xs">Rating</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">BookMark</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-green-500">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">Comment</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-500">
                <Share2 className="w-5 h-5" />
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Description</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed line-clamp-4">
                {book.description}
              </p>
            </CardContent>
          </Card>
          <div className="mt-5 mb-8">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <ChapterContainer
                    // coverImage={book.image_urls[0]}
                    title={book.name}
                    chapters={chapters as Chapter[]}
                    totalChapters={chapters.length}
                  ></ChapterContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="w-[300px]  flex flex-col gap-5">
          <div className="space-y-4">
            {/* Translator Info */}
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-gray-500 mb-2">Translater</div>
                <div className="font-semibold mb-3">
                  Todo : add field trans,Có thể là bình luận mới hay thông báo
                  ,...
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
