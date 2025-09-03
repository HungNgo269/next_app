import Header from "@/app/ui/user/headerCustomer/headerMain";
import { HeaderWrapper } from "../ui/user/headerCustomer/headerWrapper";

export default async function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HeaderWrapper children={<Header></Header>}></HeaderWrapper>
      {children}
    </div>
  );
}
