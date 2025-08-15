import { Heart, Star, BookOpen, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { fetchBookByIdActions } from "@/app/actions/bookActions";
import { fetchCategoryOfBookAction } from "@/app/actions/categoryActions";
import Link from "next/link";
import { ChapterContainer } from "@/app/ui/chapter/chapterContainer";

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { bookId } = await params;
  const [bookData, bookCategories] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchCategoryOfBookAction(bookId),
  ]);
  const book = bookData[0];
  console.log("bc", bookCategories);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full h-64 relative">
        <Image
          src={book.image_urls[0]}
          alt="book banner"
          fill
          className="opacity-90 blur-sm object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className=" mx-auto px-4 h-full flex items-end pb-6">
            <div className="flex items-center gap-6 w-[1200px] mx-auto">
              <div className="relative w-[200px] h-fit flex-shrink-0 mt-12 rounded-md">
                <Image
                  src={book.image_urls[0]}
                  alt="book cover"
                  width={0}
                  height={0}
                  sizes="200px"
                  style={{
                    width: "200px",
                    height: "auto",
                    borderRadius: "10px",
                  }}
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
                  <Link href={category.url}>
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
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-500">
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
          <div className="mt-5">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-row items-center justify-start space-x-3 mb-3 gap-4">
                    <Image
                      src="/testbookcover.png"
                      alt="book cover"
                      width={0}
                      height={0}
                      sizes="125px"
                      style={{
                        width: "125px",
                        height: "auto",
                        borderRadius: "10px",
                      }}
                    />
                    <div className="h-full flex flex-col items-start">
                      <ChapterContainer></ChapterContainer>
                    </div>
                  </div>
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
    </div>
  );
}
