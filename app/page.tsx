import { Suspense } from "react";
import Carousel from "@/app/ui/slides/slidev2";
import NewChapterList from "@/app/ui/books/newChapterList";
import MostFollowBook from "@/app/ui/graph/mostFollowBook";
import BestSeller from "@/app/ui/books/bestSeller";
import Header from "./ui/headerCustomer/headerMain";
import Footer from "./ui/footer/footerMain";
import Banner from "./ui/banner/bannerMain";
import RecentlyDiscoveredSection from "./ui/books/newBook";

export default function HomePage() {
  return (
    <>
      <header className="ml-auto mr-auto w-[1190px]">
        <Suspense>
          <Header></Header>
        </Suspense>
      </header>
      <div className=" mx-auto mt-10 w-[1190px]">
        <Suspense>
          <Carousel />
        </Suspense>

        <Suspense>
          <BestSeller />
        </Suspense>
        <div className="flex  justify-between mt-10">
          <div className="w-[840px]  ">
            <Suspense>
              <NewChapterList />
            </Suspense>
          </div>
          <div className="w-[300px]  ">
            <Suspense>
              <MostFollowBook />
            </Suspense>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Banner></Banner>
        </div>
      </div>
      <div className=" mx-auto mt-10 w-[1190px]">
        <Suspense>
          <Footer></Footer>
        </Suspense>
      </div>
    </>
  );
}
