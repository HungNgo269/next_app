import { Suspense } from "react";

import { BookOpen, Download, Users } from "lucide-react";
import Carousel from "./ui/admin/slides/slidev2";
import Image from "next/image";
import Header from "./ui/user/headerCustomer/headerMain";
import BestSellerContainer from "./ui/user/books/bestSellerContainer";
import NewBookList from "./ui/user/books/newBookList";
import NewChapterList from "./ui/user/books/newChapterList";
import BookRecommend from "./ui/user/books/bookRecommend";
import MostPopularBook from "./ui/user/ranking/mostPopularBook";
import MostPopularSeries from "./ui/user/ranking/mostPopularSeries";
import FooterComponent from "./ui/user/footer/footerComponent";
import SectionComponent from "./ui/user/section/section";
import { ScrollHeader } from "./ui/user/headerCustomer/scrollHeader";

export default function HomePage() {
  return (
    <>
      <header className="ml-auto mr-auto  ">
        <Suspense>
          <ScrollHeader children={<Header></Header>}></ScrollHeader>
        </Suspense>
      </header>
      <Suspense>
        <Carousel />
      </Suspense>
      <div className=" mx-auto mt-10 w-[1190px]">
        <Suspense>
          <BestSellerContainer />
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
            {/* <Suspense>
              <section className="mb-10">
                <Image
                  src="/testwideimg.jpg"
                  alt="Banner"
                  width={300}
                  height={0}
                  className="h-auto rounded-[8px]"
                />
              </section>
            </Suspense> */}
          </div>
        </div>
        <Suspense>
          <SectionComponent></SectionComponent>
        </Suspense>
      </div>
      <div className=" mx-auto mt-10 w-[1190px]">
        <Suspense>
          <FooterComponent></FooterComponent>
        </Suspense>
      </div>
    </>
  );
}
