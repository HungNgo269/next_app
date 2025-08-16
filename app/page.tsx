import { Suspense } from "react";
import Carousel from "@/app/ui/slides/slidev2";
import NewChapterList from "@/app/ui/books/newChapterList";
import BestSeller from "@/app/ui/books/bestSellerContainer";
import Header from "./ui/headerCustomer/headerMain";
import Footer from "./ui/footer/footerMain";
import Banner from "./ui/banner/bannerMain";
import NewBookList from "./ui/books/newBookList";
import MostPopularBook from "@/app/ui/ranking/mostPopularBook";
import AppFeature from "./ui/section/feature";
import BookRecommend from "./ui/books/bookRecommend";
import MostPopularSeries from "./ui/ranking/mostPopularSeries";

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
          <div className="w-[850px]   flex flex-col gap-5">
            <Suspense>
              <NewBookList />
            </Suspense>

            <Suspense>
              <NewChapterList />
            </Suspense>
            <Suspense>
              <BookRecommend></BookRecommend>
            </Suspense>
          </div>
          <div className="w-[300px]  flex flex-col gap-5">
            <Suspense>
              <MostPopularBook />
            </Suspense>
            <Suspense>
              <MostPopularSeries />
            </Suspense>
            <Suspense>
              <Banner width={300} />
            </Suspense>
          </div>
        </div>
        <AppFeature></AppFeature>
      </div>
      <div className=" mx-auto mt-10 w-[1190px]">
        <Suspense>
          <Footer></Footer>
        </Suspense>
      </div>
    </>
  );
}
