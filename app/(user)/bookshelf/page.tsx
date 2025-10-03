import { GetFollowedBooksAction } from "@/app/actions/bookFollowActions";
import ImageCard from "@/app/ui/share/image/imageCard";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/formatDate";
import { getSessionCache } from "@/lib/utils/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";

type FollowedBook = {
  id: number;
  name: string;
  author: string | null;
  description: string | null;
  image_urls: string[] | string | null;
  rating: number | string | null;
  views: number | string | null;
  status: string | null;
  popularity: number | string | null;
  latest_chapter_id: number | string | null;
  latest_chapter_number: number | string | null;
  latest_chapter_date: string | null;
};

const stripHtml = (value?: string | null) => {
  if (!value) {
    return "";
  }
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const getCoverImage = (image: FollowedBook["image_urls"]) => {
  if (Array.isArray(image) && image.length > 0) {
    return image[0];
  }
  if (typeof image === "string" && image.length > 0) {
    return image;
  }
  return "/default-cover.png";
};

const formatMetric = (value: FollowedBook["rating" | "views" | "popularity"]): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return null;
  }
  return numberValue;
};

export default async function BookShelfPage() {
  const session = await getSessionCache();
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    const callbackUrl = encodeURIComponent("/bookshelf");
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const followedRows = (await GetFollowedBooksAction(userId)) ?? [];
  const followedBooks = followedRows as FollowedBook[];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-secondary-foreground">
            Your Book Shelf
          </h1>
          <p className="text-muted-foreground">
            Keep track of the series you follow and jump back in whenever new chapters drop.
          </p>
        </div>

        {followedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            <p>You have not followed any books yet.</p>
            <p className="text-sm">
              Browse our collection and use the follow button on a book page to add it to your shelf.
            </p>
            <Button asChild>
              <Link prefetch={true} href="/book?page=1">
                Discover books
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {followedBooks.map((book) => {
              const coverImage = getCoverImage(book.image_urls);
              const ratingValue = formatMetric(book.rating);
              const viewsValue = formatMetric(book.views);
              const popularityValue = formatMetric(book.popularity);
              const description = stripHtml(book.description);
              const latestChapterId =
                book.latest_chapter_id !== null &&
                book.latest_chapter_id !== undefined
                  ? Number(book.latest_chapter_id)
                  : null;
              const latestChapterNumber =
                book.latest_chapter_number !== null &&
                book.latest_chapter_number !== undefined
                  ? Number(book.latest_chapter_number)
                  : null;
              const hasLatestChapter =
                latestChapterId !== null && !Number.isNaN(latestChapterId);
              const latestChapterDate = book.latest_chapter_date
                ? formatRelativeTime(book.latest_chapter_date)
                : null;

              return (
                <div
                  key={book.id}
                  className="flex flex-col gap-4 rounded-lg border bg-card/50 p-4 transition hover:border-primary/70 md:flex-row"
                >
                  <Link
                    prefetch={true}
                    href={`book/${book.id}`}
                    className="relative h-48 w-full overflow-hidden rounded-md md:h-32 md:w-24"
                  >
                    <ImageCard bookImage={coverImage} bookName={book.name} />
                  </Link>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="space-y-1">
                      <Link
                        prefetch={true}
                        href={`book/${book.id}`}
                        className="text-lg font-semibold text-secondary-foreground hover:underline"
                      >
                        {book.name}
                      </Link>
                      {book.author ? (
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      ) : null}
                    </div>

                    {description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {latestChapterNumber !== null ? (
                        <span>Latest chapter: {latestChapterNumber}</span>
                      ) : null}
                      {latestChapterDate ? <span>Updated {latestChapterDate}</span> : null}
                      {ratingValue !== null ? (
                        <span>Rating: {ratingValue.toFixed(1)}</span>
                      ) : null}
                      {viewsValue !== null ? (
                        <span>Views: {viewsValue.toLocaleString()}</span>
                      ) : null}
                      {popularityValue !== null ? (
                        <span>Popularity: {popularityValue}</span>
                      ) : null}
                      {book.status ? <span>Status: {book.status}</span> : null}
                    </div>
                  </div>

                  <div className="flex w-full flex-col justify-between gap-3 md:w-auto md:items-end">
                    <Button asChild className="w-full md:w-auto">
                      <Link prefetch={true} href={`book/${book.id}`}>
                        View book details
                      </Link>
                    </Button>
                    {hasLatestChapter ? (
                      <Button asChild variant="secondary" className="w-full md:w-auto">
                        <Link
                          prefetch={true}
                          href={`book/${book.id}/chapter/${latestChapterId}`}
                        >
                          Read latest chapter
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

