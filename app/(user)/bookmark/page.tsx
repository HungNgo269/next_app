import { fetchChapterByBookmarkAction } from "@/app/actions/chapterActions";
import { getSessionCache } from "@/lib/utils/getSession";
import ImageCard from "@/app/ui/share/image/imageCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

type BookmarkEntry = {
  id: number; //chapterId
  book_id: number;
  title: string; //chapterTitle
  chapter_number: number;
  progress: number;
  name: string;
  image_urls: string;
  description: string;
  rating: number;
  author: string;
};
export default async function BookMarkPage() {
  const session = await getSessionCache();
  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    const callbackUrl = encodeURIComponent("/bookmark");
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const bookmarkRows = (await fetchChapterByBookmarkAction(userId)) ?? [];
  const bookmarks = bookmarkRows as BookmarkEntry[];
  console.log(bookmarks);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-secondary-foreground">
            Your Bookmarks
          </h1>
          <p className="text-muted-foreground">
            Resume your bookmarked chapters whenever you're ready to keep
            reading.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            <p>You haven't added any bookmarks yet.</p>
            <p className="text-sm">
              Browse the library and tap the bookmark button while reading to
              save your place.
            </p>
            <Button asChild>
              <Link prefetch={true} href="/book">
                Browse books
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.length > 0 &&
              bookmarks.map((item, index) => {
                return (
                  <div
                    key={`${index}`}
                    className="flex flex-col gap-4 rounded-lg border bg-card/50 p-4 transition hover:border-primary/70 md:flex-row md:items-center"
                  >
                    <Link
                      prefetch={true}
                      href={`book/${item.book_id}`}
                      className="relative h-48 w-full overflow-hidden rounded-md md:h-32 md:w-24"
                    >
                      <ImageCard
                        bookImage={item?.image_urls[0]}
                        bookName={item?.name}
                      />
                    </Link>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-1">
                        <Link
                          prefetch={true}
                          href={`book/${item.book_id}`}
                          className="text-lg font-semibold text-foreground hover:underline"
                        >
                          {item?.name}
                        </Link>
                        {item.author ? (
                          <p className="text-sm text-muted-foreground">
                            by {item.author}
                          </p>
                        ) : null}
                      </div>

                      <Link
                        prefetch={true}
                        href={`book/${item.book_id}/chapter/${item.id}`}
                        className="font-medium hover:underline"
                      >
                        Chapter {item.chapter_number} {item.title}
                      </Link>

                      {item ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted-foreground">
                        <span>Progress: {item.progress}%</span>
                        {item.rating ? (
                          <span>Rating: {item.rating}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex w-full justify-end md:w-auto">
                      <Button asChild className="w-full md:w-auto">
                        <Link
                          prefetch={true}
                          href={`book/${item.book_id}/chapter/${item.id}`}
                        >
                          Continue reading
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
