import Header from "@/app/ui/user/headerCustomer/headerMain";
import MostPopularBook from "@/app/ui/user/ranking/popularBook";
import FooterComponent from "@/app/ui/user/footer/footerComponent";

export default async function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Header />
      <div className="w-full max-w-[1190px] mx-auto mt-10 flex flex-row gap-5">
        <div className="xl:w-[850px] lg:w-[700px] w-full md:w-[600px] flex flex-col gap-5">
          {children}
        </div>
        <div className="w-[200px] lg:w-[300px] lg:flex flex-col gap-5 hidden">
          <MostPopularBook />
        </div>
      </div>
      <div className="mt-10">
        <FooterComponent />
      </div>
    </div>
  );
}
