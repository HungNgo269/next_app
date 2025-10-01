import { NotificationRow } from "@/app/interface/notification";
import { sql } from "@/lib/db";

export async function SaveNoti(data: NotificationRow) {
  try {
    const res = await sql`
        insert into notifications (userid,bookid,chapterid)
        values(${data.userId},${data.bookId},${data.chapterId})
        `;
    return res;
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
