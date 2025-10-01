import { fetchBookNameByBookIdAction } from "@/app/actions/bookActions";
import { GetUsersFollowBookAction } from "@/app/actions/bookFollowActions";
import { SaveNoti } from "@/app/data/notiData";
import { ChapterBase } from "@/app/interface/chapter";
import { boardcastBook } from "@/lib/sse";

export async function notifyNewChapter(chapter: ChapterBase) {
  const [bookName, followers] = await Promise.all([
    fetchBookNameByBookIdAction(chapter.book_id),
    GetUsersFollowBookAction(chapter.book_id),
  ]);

  if (followers) {
    try {
      Promise.all([
        followers.forEach(async (follower) => {
          await SaveNoti({
            bookId: chapter.book_id,
            chapterId: chapter.id,
            userId: follower,
          });
        }),
        await boardcastBook(chapter.book_id, "new_chapter", {
          chapter_number: chapter.chapter_number,
          create_at: chapter.created_at,
          title: chapter.title,
          id: chapter.id,
          message: `Don't miss Chapter ${chapter.chapter_number} of "${bookName}"now available for you to enjoy.`,
        }),
      ]);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`cant save Noti`, err.message);
    }
  }
}
