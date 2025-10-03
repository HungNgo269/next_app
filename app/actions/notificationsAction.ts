"use server";
import {
  fetchBookImageByBookIdAction,
  fetchBookNameByBookIdAction,
} from "@/app/actions/bookActions";
import { GetUsersFollowBookAction } from "@/app/actions/bookFollowActions";
import { GetNoti, SaveNoti } from "@/app/data/notiData";
import { ChapterBase } from "@/app/interface/chapter";
import { boardcastBook } from "@/lib/sse";

export async function notifyNewChapter(chapter: ChapterBase) {
  const [bookName, bookImage, followers] = await Promise.all([
    fetchBookNameByBookIdAction(chapter.book_id),
    fetchBookImageByBookIdAction(chapter.book_id),
    GetUsersFollowBookAction(chapter.book_id),
  ]);
  if (followers) {
    try {
      Promise.all([
        followers.forEach(async (follower) => {
          await SaveNoti({
            book_id: chapter.book_id,
            chapter_id: chapter.id,
            user_id: follower,
            book_name: bookName,
            book_image: bookImage,
            title: chapter.title,
            chapter_number: chapter.chapter_number,
          });
        }),
        await boardcastBook(chapter.book_id, "new_chapter", {
          chapter_number: chapter.chapter_number,
          created_at: chapter.created_at!,
          title: chapter.title,
          book_name: bookName,
          book_image: bookImage,
          book_id: chapter.book_id,
          chapter_id: chapter.id,
        }),
      ]);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`cant save Noti`, err.message);
    }
  }
}
export async function getNotiAction(userId: string, currentPage: number) {
  try {
    return await GetNoti(userId, currentPage);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`cant  getNoti action`, err.message);
  }
}
