import { Suspense } from "react";
import Carousel from "@/app/ui/slides/slidev2";
import DestinationContainer from "@/app/ui/destinations/destinationContainer";
import NewChapterList from "@/app/ui/books/NewChapterList";
import MostFollowBook from "@/app/ui/graph/MostFollowBook";
import BookContainer from "../ui/books/BookContainer";

export default function HomePage() {
  return (
    <>
      <Suspense>
        <Carousel />
      </Suspense>

      <Suspense>
        <DestinationContainer />
      </Suspense>

      <Suspense>
        <BookContainer />
      </Suspense>

      <div className="flex gap-6">
        <div className="flex-[3]">
          <Suspense>
            <NewChapterList />
          </Suspense>
        </div>
        <div className="flex-[1]">
          <Suspense>
            <MostFollowBook />
          </Suspense>
        </div>
      </div>
    </>
  );
}
