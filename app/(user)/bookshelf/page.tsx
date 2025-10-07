import { GetFollowedBooksAction } from "@/app/actions/bookFollowActions";
import ImageCard from "@/app/ui/share/image/imageCard";
import { Button } from "@/components/ui/button";
import { getSessionCache } from "@/lib/utils/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";

type FollowedBook = {
  id: number;
  name: string;
  author: string;
  description: string;
  image_urls: string;
  rating: number;
  views: number;
  status: string;
  popularity: number;
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
  console.log(followedBooks);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Your Book Shelf
          </h1>
          <p className="text-muted-foreground">
            Keep track of the series you follow and jump back in whenever new
            chapters drop.
          </p>
        </div>

        {followedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            <p>You have not followed any books yet.</p>
            <p className="text-sm">
              Browse our collection and use the follow button on a book page to
              add it to your shelf.
            </p>
            <Button asChild>
              <Link prefetch={true} href="/book?page=1">
                Discover books
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {followedBooks.map((book, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-lg border bg-card/50 p-4 transition hover:border-primary/70 md:flex-row"
                >
                  <Link
                    prefetch={true}
                    href={`book/${book.id}`}
                    className="relative h-48 w-full overflow-hidden rounded-md md:h-32 md:w-24"
                  >
                    <ImageCard
                      bookImage={book.image_urls[0]}
                      bookName={book.name}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="space-y-1">
                      <Link
                        prefetch={true}
                        href={`book/${book.id}`}
                        className="text-lg font-semibold text-foreground hover:underline"
                      >
                        {book.name}
                      </Link>
                      {book.author ? (
                        <p className="text-sm text-muted-foreground">
                          by {book.author}
                        </p>
                      ) : null}
                    </div>

                    {book.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {book.description}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Rating: {book.rating}</span>
                      <span>Views: {book.views}</span>
                      <span>Popularity: {book.rating}</span>
                      {book.status ? <span>Status: {book.status}</span> : null}
                    </div>
                  </div>

                  <div className="flex w-full flex-col justify-between gap-3 md:w-auto md:items-end">
                    <Button asChild className="w-full md:w-auto">
                      <Link prefetch={true} href={`book/${book.id}`}>
                        View book details
                      </Link>
                    </Button>
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
