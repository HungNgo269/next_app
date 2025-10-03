import { Notification, NotificationRow } from "@/app/interface/notification";
import { sql } from "@/lib/db";

export async function SaveNoti(data: NotificationRow) {
  try {
    const res = await sql`
        insert into notifications (user_id,book_id,chapter_id,book_image,chapter_number,title,book_name)
        values(${data.user_id},${data.book_id},${data.chapter_id},${data.book_image},${data.chapter_number},${data.title},${data.book_name})
        returning *
        `;
    return res[0] as NotificationRow;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`cant save noti db`, err.message);
  }
}
export async function readNoti(notiId: number) {
  try {
    const res = await sql`
        update  notifications set read=true where id = ${notiId}
        `;
    return res;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`cant read notifications`, err.message);
  }
}
export async function readAllNoti(userId: string) {
  try {
    const res = await sql`
        update  notifications set read=true where userId=${userId}
        `;
    return res;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`cant read all notifications`, err.message);
  }
}
const LIMIT = 5;
export async function GetNoti(userId: string, currentPage: number) {
  const OFFSET = (currentPage - 1) * LIMIT;
  try {
    const res = await sql`
        select * from notifications where user_id = ${userId} order by created_at desc LIMIT ${LIMIT} OFFSET ${OFFSET}
        `;
    return res as Notification[];
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`cant get noti db`, err.message);
  }
}
