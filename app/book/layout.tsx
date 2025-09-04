import Header from "@/app/ui/user/headerCustomer/headerMain";
import { HeaderWrapper } from "../ui/user/headerCustomer/headerWrapper";
import ConditionalHeader from "../ui/user/headerCustomer/conditionalHeader";

export default async function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ConditionalHeader>
        <HeaderWrapper children={<Header></Header>}></HeaderWrapper>
      </ConditionalHeader>
      {children}
    </div>
  );
}
