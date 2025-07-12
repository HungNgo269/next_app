import { Suspense } from "react";
import Slide from "@/app/ui/slides/slide";
import HeaderCustomer from "@/app/ui/headerCustomer/header";
import ProductContainer from "@/app/ui/products/productContainer";
import { inter } from "@/app/ui/fonts";
import Carousel from "@/app/ui/slides/slidev2";
import Header from "@/app/ui/headerCustomer/headerv2";
export default function HomePage() {
  return (
    <div
      className={`"relative bg[#f5f4fa] text-base text-black ${inter.className} font-normal"`}
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
        <ProductContainer></ProductContainer>
      </Suspense>
    </div>
  );
}
