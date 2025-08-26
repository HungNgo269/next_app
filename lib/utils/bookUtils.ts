import { Book } from "@/app/interface/book";
import { SearchParams } from "next/dist/server/request/search-params";

function filterAndSortBooks(books: Book[], params: SearchParams): Book[] {
  let filteredBooks = [...books];

  //   // Filter by genre
  //   if (params.genre && params.genre !== "all") {
  //     filteredBooks = filteredBooks.filter((book) => book.genre === params.genre);
  //   }

  // Sort books
  filteredBooks.sort((a: Book, b: Book) => {
    let comparison = 0;

    switch (params.sort) {
      case "views":
        comparison = a.views - b.views;
        break;
      //   case "rating":
      //     comparison = a.rating - b.rating;
      //     break;
      case "new":
        // Sort by publish date for "new"
        comparison =
          new Date(a.publish_date).getTime() -
          new Date(b.publish_date).getTime();
        break;
      //   case 'popular':
      //     // Sort by views for popular, but prioritize isPopular flag
      //     if (a.isPopular && !b.isPopular) return -1
      //     if (!a.isPopular && b.isPopular) return 1
      //     comparison = a.views - b.views
      //     break
      default:
        comparison = a.title.localeCompare(b.title);
    }

    // Apply order (default desc for most sorts)
    const order = params.order || "desc";
    return order === "asc" ? comparison : -comparison;
  });

  return filteredBooks;
}
