import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchBookByIdActions,
  fetchTotalChapterInBookByIdAction,
} from "@/app/actions/bookActions";
import Active from "@/app/ui/admin/slides/active";
import StatusLabel from "@/app/ui/admin/slides/status";
import type { Book } from "@/app/interface/book";
import { Button } from "@/components/ui/button";
import { formatEnDate } from "@/lib/utils/formatDate";
import { fetchCategoryOfBookAction } from "@/app/actions/categoryActions";

type PageProps = {
  params: Promise<{
    bookId: number;
  }>;
};

export default async function BookDetailsPage({ params }: PageProps) {
  const { bookId } = await params;

  const [bookRows, totalChapters, bookCategories] = await Promise.all([
    fetchBookByIdActions(bookId),
    fetchTotalChapterInBookByIdAction(bookId),
    fetchCategoryOfBookAction(bookId),
  ]);

  const book = (bookRows?.[0] ?? undefined) as Book | undefined;

  if (!book) {
    notFound();
  }

  const coverImage = book.image_urls?.[0] ?? "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center space-x-2 text-lg text-muted-foreground mb-6">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/dashboard/books"
              className="hover:text-foreground transition-colors"
            >
              Books
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{book.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative h-80 w-56 sm:h-96 sm:w-64 rounded-lg overflow-hidden border shadow-md">
                <Image
                  src={coverImage}
                  alt={book.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 224px, 256px"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {book.name}
                </h1>

                {book.author && (
                  <p className="text-lg text-muted-foreground">
                    by{" "}
                    <span className="text-foreground font-medium">
                      {book.author}
                    </span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {book.status && <StatusLabel status={book.status} />}
                  <Active status={book.is_active} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="text-2xl font-bold text-foreground">
                    {book.popularity || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Popularity
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="text-2xl font-bold text-foreground">
                    {book.rating || "-"}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="text-2xl font-bold text-foreground">
                    {totalChapters}
                  </div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
              </div>

              {bookCategories.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bookCategories.map((cate) => (
                      <span
                        key={cate.name}
                        className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                      >
                        {cate.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button asChild size="lg" className="shadow-sm">
                  <Link
                    href={`/dashboard/books/${book.id}/chapters?page=1&query=`}
                  >
                    View Chapters
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
          <div className="space-y-3">
            {[
              { label: "Published", date: book.publish_date },
              { label: "Created", date: book.created_at },
              { label: "Last Updated", date: book.updated_at },
            ]
              .filter((item) => item.date)
              .map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">
                    {formatEnDate(item.date!)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>
          <div className="p-6 rounded-lg border bg-muted/30">
            {book.description ? (
              <div
                className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            ) : (
              <p className="text-muted-foreground italic">
                No description available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
