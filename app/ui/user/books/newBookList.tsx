import { Book, BookCardProps } from "@/app/interface/book";
import BookCarousel from "@/app/ui/user/books/bookCarousel";
import ViewMoreBookButton from "@/app/ui/user/books/viewMoreBookButton";
import { fetchNewBookAction } from "@/app/actions/bookActions";

export default async function NewBookList() {
  const Books = (await fetchNewBookAction()) as unknown as BookCardProps[];
  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <span className="font-bold text-2xl text-start flex-1 min-w-0 truncate ">
          New Book
        </span>
        <ViewMoreBookButton url="/book"></ViewMoreBookButton>
      </div>

      <BookCarousel
        variant="sm"
        key="new-book-carousel"
        books={Books}
      ></BookCarousel>
    </div>
  );
}
