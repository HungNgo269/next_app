import { fetchChapterByBookmarkAction } from "@/app/actions/chapterActions";
import { Chapter } from "@/app/interface/chapter";
import ChapterCard from "@/app/ui/user/chapter/chapterCard";
import { getSessionCache } from "@/lib/utils/getSession";

export default async function BookMarkPage() {
  const session = await getSessionCache();
  const user = session?.user;
  const chapters = await fetchChapterByBookmarkAction(user?.id ?? "");
  console.log("first", chapters);
  return <div className="grid md:grid-cols-2 gap-2 grid-cols-1"></div>;
}
