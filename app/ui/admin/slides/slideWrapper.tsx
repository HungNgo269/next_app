import { fetchAllSlideAction } from "@/app/actions/slideActions";
import { ISlide } from "@/app/interface/slide";
import Slide from "@/app/ui/admin/slides/slide";
import { Suspense } from "react";
import { SlideSkeleton } from "@/app/ui/skeletons";

export default async function SlideWrapper() {
  const dataSlides = (await fetchAllSlideAction()) as ISlide[];
  return (
    <Suspense fallback={<SlideSkeleton></SlideSkeleton>}>
      <Slide slides={dataSlides}></Slide>
    </Suspense>
  );
}
