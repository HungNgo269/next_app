import Header from "@/app/ui/user/headerCustomer/headerMain";
import MostPopularBook from "@/app/ui/user/ranking/popularBook";
import FooterComponent from "@/app/ui/user/footer/footerComponent";

export default async function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header></Header>
      <div className="w-full mx-auto mt-10 sm:w-[1190px] flex flex-row gap-5">
        <div className="w-[850px]   flex flex-col gap-5">{children}</div>
        <div className="w-[300px]  flex flex-col gap-5">
          <MostPopularBook />
        </div>
      </div>
      <div className="mt-10">
        <FooterComponent></FooterComponent>
      </div>
    </div>
  );
}
