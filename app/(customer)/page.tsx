import { Suspense } from "react";
import Slide from "@/app/ui/slides/slide";
import HeaderCustomer from "@/app/ui/headerCustomer/header";
import ProductContainer from "@/app/ui/products/productContainer";
import { inter } from "@/app/ui/fonts";
import Carousel from "@/app/ui/slides/slidev2";
import Header from "@/app/ui/headerCustomer/headerv2";
import DestinationContainer from "@/app/ui/destinations/destinationContainer";
import BookContainer from "@/app/ui/books/BookContainer";
import NewChapterList from "@/app/ui/books/NewChapterList";
export default function HomePage() {
  return (
    <div
      className={`relative bg[#f5f4fa] text-base text-black ${inter.className} font-normal px-12 `}
    >
      <Suspense>
        <Header></Header>
        {/* <HeaderCustomer></HeaderCustomer> */}
      </Suspense>

      <Suspense>
        <Carousel></Carousel>
        {/* <Slide></Slide> */}
      </Suspense>
      <Suspense>
        <DestinationContainer></DestinationContainer>
      </Suspense>

      <Suspense>
        <BookContainer></BookContainer>
        {/* <ProductContainer></ProductContainer> */}
      </Suspense>

      <Suspense>
        <NewChapterList></NewChapterList>
      </Suspense>
    </div>
  );
}
