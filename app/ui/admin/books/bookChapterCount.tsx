import { fetchTotalChapterInBookByIdAction } from "@/app/actions/bookActions";

interface props {
  bookId: number;
}
export default async function BookChapterCount({ bookId }: props) {
  const bookChaptes = await fetchTotalChapterInBookByIdAction(bookId);
  console.log("check", bookChaptes);
  return <span>{`${bookChaptes}`}</span>;
}
