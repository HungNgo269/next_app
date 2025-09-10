import Header from "@/app/ui/user/headerCustomer/headerMain";
import { HeaderWrapper } from "@/app/ui/user/headerCustomer/headerWrapper";
import ConditionalHeader from "@/app/ui/user/headerCustomer/conditionalHeader";

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
