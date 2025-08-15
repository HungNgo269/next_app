import { Card, CardContent } from "@/components/ui/card";
import { Badge, ChevronRight } from "lucide-react";
import Image from "next/image";
import ViewMoreBookButton from "./viewMoreBookButton";

export default function BookRecommend() {
  const recommendedBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      description:
        "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived...",
      cover:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      tags: ["Fiction", "Philosophy", "Self-Discovery"],
      badge: "Bestseller",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      description:
        "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results. Transform your life with the power of atomic habits...",
      cover:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      tags: ["Self-Help", "Productivity", "Psychology"],
      badge: "Popular",
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      description:
        "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. A thrilling space adventure...",
      cover:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      tags: ["Sci-Fi", "Adventure", "Space"],
      badge: "Award Winner",
    },
  ];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Our Recommended Books
        </h2>
        <ViewMoreBookButton url="/"></ViewMoreBookButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedBooks.map((book) => (
          <Card
            key={book.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="relative">
              <Image
                src={book.cover}
                alt={`${book.title} cover`}
                width={200}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 text-white">
                {book.badge}
              </Badge>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                </div>

                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
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
