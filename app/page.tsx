import { Suspense } from "react";
import Header from "@/app/ui/user/headerCustomer/headerMain";
import BestSellerContainer from "@/app/ui/user/books/bestSellerContainer";
import NewBookList from "@/app/ui/user/books/newBookList";
import BookRecommend from "@/app/ui/user/books/bookRecommend";
import MostPopularBook from "@/app/ui/user/ranking/popularBook";
import FooterComponent from "@/app/ui/user/footer/footerComponent";
import SectionComponent from "@/app/ui/user/section/section";
import { HeaderWrapper } from "@/app/ui/user/headerCustomer/headerWrapper";
import SlideWrapper from "@/app/ui/admin/slides/slideWrapper";
import NewChapterList from "@/app/ui/user/chapter/newChapterList";
import SseClient from "@/app/ui/user/test/SseClient";
//ALL SEO created by codex

export default function HomePage() {
  return (
    <div
      className="bg-gradient-to-br from-slate-50 via-white to-slate-50
     dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <header className="ml-auto mr-auto w-full  ">
        <Suspense>
          <HeaderWrapper children={<Header></Header>}></HeaderWrapper>,
        </Suspense>
      </header>
      <SlideWrapper />
      <div className="w-full mx-auto mt-10 md:w-[700px] lg:w-[900px]  xl:w-[1190px] ">
        {/* <SseClient></SseClient> */}
        <Suspense>
          <BestSellerContainer />
        </Suspense>
        <div className="flex  justify-between mt-10 lg:flex-row flex-col">
          <div className="lg:w-[850px] md:w-[700px]  flex flex-col gap-5">
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
          <div className="lg:w-[300px] md:w-[400px] flex flex-col gap-5">
            <MostPopularBook />
          </div>
        </div>
        <div className="hidden sm:block">
          <Suspense>
            <SectionComponent></SectionComponent>
          </Suspense>
        </div>
      </div>
      <div className="w-full">
        <Suspense>
          <FooterComponent></FooterComponent>
        </Suspense>
      </div>
    </div>
  );
}
