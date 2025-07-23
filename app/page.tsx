import { Suspense } from "react";
import Carousel from "@/app/ui/slides/slidev2";
import DestinationContainer from "@/app/ui/destinations/destinationContainer";
import NewChapterList from "@/app/ui/books/newChapterList";
import MostFollowBook from "@/app/ui/graph/mostFollowBook";
import BookContainer from "@/app/ui/books/bookContainer";
import Header from "./ui/headerCustomer/headerMain";

export default function HomePage() {
  return (
    <>
      <Suspense>
        <Header></Header>
      </Suspense>
      <Suspense>
        <Carousel />
      </Suspense>

      <Suspense>
        <DestinationContainer />
      </Suspense>

      <Suspense>
        <BookContainer />
      </Suspense>

      <div className="flex gap-6 mt-10">
        <div className="flex-[3] ">
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
