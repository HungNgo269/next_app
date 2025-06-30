import { Suspense } from "react";
import Slide from "@/app/ui/slide/slide";
export default function HomePage() {
  return (
    <div className="relative">
      <Suspense>
        <Slide></Slide>
      </Suspense>
    </div>
  );
}
