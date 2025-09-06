import { Card, CardContent } from "@/components/ui/card";
import { Badge, ChevronRight } from "lucide-react";
import Image from "next/image";
import ViewMoreBookButton from "./viewMoreBookButton";
import { fetchOurRecommendedBookAction } from "@/app/actions/bookActions";
import { RecommendedBookProps } from "@/app/interface/book";

export default async function BookRecommend() {
  //hard code
  const recommendedBooks: RecommendedBookProps[] = await Promise.all([
    fetchOurRecommendedBookAction(1),
    fetchOurRecommendedBookAction(2),
    fetchOurRecommendedBookAction(3),
  ]);
  console.log("recpm", recommendedBooks);
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <span className="font-bold text-2xl text-start flex-1 min-w-0 truncate">
          Our Choice
        </span>
        <ViewMoreBookButton url="/"></ViewMoreBookButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedBooks.map((book: RecommendedBookProps) => (
          <Card
            key={book.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="relative">
              <Image
                src={book?.image_urls}
                alt={`${book.name} cover`}
                width={200}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 text-white">
                {book.badges[0].icon}
              </Badge> */}
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-1 hover:underline">
                    {book.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 hover:underline">
                    {book.author}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
                {/* Nếu muốn đẹp => customize icon với chọn màu trong db lại */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {book.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-background text-foreground rounded-full hover:bg-primary/15 transition-colors cursor-pointer"
                    >
                      #{badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
