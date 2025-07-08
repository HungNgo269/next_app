import { Suspense } from "react";
import Slide from "@/app/ui/slides/slide";
import HeaderCustomer from "@/app/ui/dashboardCustomer/header";
export default function HomePage() {
  return (
    <div className="relative">
      <Suspense>
        <HeaderCustomer></HeaderCustomer>
      </Suspense>

      <Suspense>
        <Slide></Slide>
      </Suspense>
    </div>
  );
}
