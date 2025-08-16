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

const book1Chapters = [
  {
    id: "1",
    title: "Chương 01 - Ma Pháp Thiếu Nữ Hệ Vật Lý!",
    date: "2025-07-30 09:00:00",
  },
  {
    id: "2",
    title: "Chương 02 - Kỳ Kết Khế Ước, Trở Thành Ma Pháp Thiếu Nữ Đi!",
    date: "2025-07-30 09:00:00",
  },
  {
    id: "3",
    title: "Chương 03 - TS Ma Pháp Thiếu Nữ Ngữa Tay, Khao Khát Đánh Nhau!",
    date: "2025-07-30 09:00:00",
  },
  {
    id: "4",
    title: "Chương 04 - Ma Pháp Thiếu Nữ Hệ Vật Lý, Lộ Diện Nữa Mặt!",
    date: "2025-07-30 09:00:00",
  },
  {
    id: "5",
    title: "Chương 05 - Ma Pháp Thiếu Nữ Hệ Vật Lý, Chạm Trần Cần Bộ!",
    date: "2025-07-30 09:00:00",
  },
  {
    id: "6",
    title: "Chương 06 - Ma Pháp Thiếu Nữ Và Cuộc Chiến Đầu Tiên!",
    date: "2025-07-31 09:00:00",
  },
  {
    id: "7",
    title: "Chương 07 - Sức Mạnh Thật Sự Của Hệ Vật Lý!",
    date: "2025-07-31 09:00:00",
  },
  {
    id: "8",
    title: "Chương 08 - Đối Thủ Mới Xuất Hiện!",
    date: "2025-08-01 09:00:00",
  },
  {
    id: "9",
    title: "Chương 09 - Ma Pháp Thiếu Nữ Trong Nguy Hiểm!",
    date: "2025-08-01 09:00:00",
  },
  {
    id: "10",
    title: "Chương 10 - Bí Mật Được Tiết Lộ!",
    date: "2025-08-02 09:00:00",
  },
];
const book2Chapters = [
  {
    id: "1",
    title: "Chương 01 - TS Thiếu nữ và thanh mai trúc mã sẽ không có romcom",
    date: "2025-08-08 09:00:00",
    isNew: true,
  },
  {
    id: "2",
    title: "Chương 02 - Thì giữa kỳ!",
    date: "2025-08-09 09:00:00",
    isNew: true,
  },
  {
    id: "3",
    title: "Chương 03 - Hai người sống chung?",
    date: "2025-08-09 09:00:00",
    isNew: true,
  },
  {
    id: "4",
    title: "Chương 04 - Tìm đáp thình thịch",
    date: "2025-08-09 09:00:00",
    isNew: true,
  },
  {
    id: "5",
    title: "Chương 05 - Người? Cá? Nhân ngư?",
    date: "2025-08-09 09:00:00",
    isNew: true,
  },
  {
    id: "6",
    title: "Chương 06 - Hải sản cấp tốc",
    date: "2025-08-14 09:00:00",
    isNew: true,
  },
  {
    id: "7",
    title: "Chương 07 - Người tình kẻ tài",
    date: "2025-08-14 09:00:00",
    isNew: true,
  },
  {
    id: "8",
    title: "Chương 08 - Ước hẹn",
    date: "2025-08-14 09:00:00",
    isNew: true,
  },
  {
    id: "9",
    title: "Chương 09 - Công viên",
    date: "2025-08-14 09:00:00",
    isNew: true,
  },
  {
    id: "10",
    title: "Chương 10 - Cuộc hẹn đầu tiên",
    date: "2025-08-15 09:00:00",
    isNew: true,
  },
  {
    id: "11",
    title: "Chương 11 - Tình cảm phức tạp",
    date: "2025-08-15 09:00:00",
    isNew: true,
  },
  {
    id: "12",
    title: "Chương 12 - Hiểu lầm và giải thích",
    date: "2025-08-16 09:00:00",
    isNew: true,
  },
  {
    id: "13",
    title: "Chương 13 - Quyết định quan trọng",
    date: "2025-08-16 09:00:00",
    isNew: true,
  },
  {
    id: "14",
    title: "Chương 14 - Tương lai bất định",
    date: "2025-08-17 09:00:00",
    isNew: true,
  },
];

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
                      <ChapterContainer
                        title="Quyển 1: Ma Pháp Thiếu Nữ Hệ Vật Lý? (Hoàn Thành)"
                        coverImage="/placeholder.svg?height=160&width=120"
                        chapters={book1Chapters}
                        totalChapters={62}
                      ></ChapterContainer>
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
