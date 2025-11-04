import { fetchNewestChapterAction } from "../actions/chapterActions";
import { BookNewChapterCard, ChapterCardProps } from "../interface/chapter";
import ChapterCard from "../ui/user/chapter/chapterCard";

export default async function ChapterList({
  currentPage,
}: {
  currentPage: number;
}) {
  const books = await fetchNewestChapterAction(currentPage);
  return (
    <>
      {books && books.length > 0
        ? ""
        : books.map((book: BookNewChapterCard) => (
            <ChapterCard Books={book} key={book.book_id} />
          ))}
    </>
  );
}
