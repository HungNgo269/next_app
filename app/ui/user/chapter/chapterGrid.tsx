import ChapterCard from "@/app/ui/user/chapter/chapterCard";
import { BookNewChapterCard } from "@/app/interface/chapter";
import {
  fetchNewestChapterAction,
  fetchNewestChapterForLoggedUserAction,
} from "@/app/actions/chapterActions";
import { getSessionCache } from "@/lib/utils/getSession";

interface Props {
  page: number;
}

export default async function ChapterGrid({ page }: Props) {
  const session = await getSessionCache();
  const user = session?.user;
  let Books;
  if (user) {
    Books = await fetchNewestChapterForLoggedUserAction(page, user.id);
  } else {
    Books = await fetchNewestChapterAction(page);
  }
  console.log("books", Books);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full">
      {Books?.map((Books: BookNewChapterCard) => (
        <ChapterCard key={Books.book_id} Books={Books} />
      ))}
    </div>
  );
}
