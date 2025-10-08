import Header from "../ui/user/headerCustomer/headerMain";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header></Header>
      <main className="flex  items-center justify-center mx-auto">
        <div className="relative w-full">{children}</div>
      </main>
    </div>
  );
}
