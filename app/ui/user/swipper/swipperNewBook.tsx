import { fetchNewBookAction } from "@/app/actions/bookActions";
import { Book, BookCardProps } from "@/app/interface/book";
import Swipper from "@/app/ui/user/swipper/swipper";

export default async function SwipperNewBook() {
  const Books = (await fetchNewBookAction()) as unknown as BookCardProps[];
  return <Swipper books={Books}></Swipper>;
}
