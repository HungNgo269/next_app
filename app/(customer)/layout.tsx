import { Suspense } from "react";
import HeaderCustomer from "../ui/headerCustomer/header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-[#f5f4fa] text-base text-black">
      <Suspense>
        <HeaderCustomer />
      </Suspense>
      {children}
    </div>
  );
}
