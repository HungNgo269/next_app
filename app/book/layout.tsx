import Header from "@/app/ui/user/headerCustomer/headerMain";
import { ScrollHeader } from "../ui/user/headerCustomer/scrollHeader";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ScrollHeader children={<Header></Header>}></ScrollHeader>
      {children}
    </div>
  );
}
