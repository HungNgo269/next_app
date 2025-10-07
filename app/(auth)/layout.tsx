import Header from "@/app/ui/user/headerCustomer/headerMain";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header></Header>
      <main className="flex  items-center justify-center md:h-screen">
        <div className="relative w-full">{children}</div>
      </main>
    </>
  );
}
