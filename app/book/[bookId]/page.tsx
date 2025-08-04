import {
  Heart,
  Star,
  BookOpen,
  MessageCircle,
  Share2,
  Plus,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { sql } from "@/app/lib/db";
import { Book } from "@/app/interface/book";

interface BookPageID {
  BookId: string;
}

export default async function BookCard({ BookId }: BookPageID) {
  const data: Book[] = await sql`SELECT * from Books`;
  const book: Book = data[0];
  console.log("book", book);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full h-64 relative">
        {/* Background blurred image */}
        <Image
          src={book.image_urls[0]}
          alt="book banner"
          fill
          className="opacity-90 blur-sm object-cover"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className=" mx-auto px-4 h-full flex items-end pb-6">
            <div className="flex items-end gap-6 w-full">
              {/* Book cover */}
              <div className="relative w-[200px] h-fit flex-shrink-0 mt-12 rounded-md">
                <Image
                  src="/testbookcover.png"
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

              {/* Book info */}
              <div className="flex-1 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  "Don't take it wrong!" That's what my childhood friend who
                  gave me love chocolate said, but what does that mean don't
                  take it wrong!?
                </h1>
                <p className="text-lg md:text-xl text-gray-200">
                  {book.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 pb-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 mb-4">
                  Truyện dịch
                </Button>

                {/* Heart Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Heart className="w-12 h-12 text-gray-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-center space-y-2">
                  <div>
                    <div className="text-xs text-gray-500">Thời gian</div>
                    <div className="font-semibold">3 năm</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Số từ</div>
                    <div className="font-semibold">1.215</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Đánh giá</div>
                    <div className="font-semibold">4,00 / 1</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Lượt xem</div>
                    <div className="font-semibold">142.197</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Comedy</Badge>
                  <Badge variant="secondary">Romance</Badge>
                  <Badge variant="secondary">School Life</Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Tác giả:</span> 明石台
                  </div>
                  <div>
                    <span className="font-medium">Tình trạng:</span> Đã hoàn
                    thành
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-6">
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">144</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-yellow-500">
                    <Star className="w-5 h-5" />
                    <span className="text-xs">Đánh giá</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-500">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs">Mục lục</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-green-500">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">Bàn luận</span>
                  </button>
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-500">
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Tóm tắt</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Câu chuyện về kế muốn nhận được sô-cô-la tình yêu vào ngày
                    valentine, Hoshimi Akira và người đáp lại mong muốn của cậu,
                    Kurnosaki Karin hay cũng chính là bạn thúa nhỏ của cậu.
                  </p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Reviews mới</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-blue-600">
                            Miyazumillllll
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <Star className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          nói dung ơn
                        </p>
                        <span className="text-xs text-gray-400">2 năm</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Translator Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        AzenKain
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Nhóm dịch</div>
                  <div className="font-semibold mb-3">Akarui Team</div>
                  <div className="text-xs text-gray-500 mb-1">
                    Tham gia: Aday
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                    <div
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Chapter section */}
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
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                    <div className=" hover:bg-gray-400">Chương ...</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
