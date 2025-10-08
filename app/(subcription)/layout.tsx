import Header from "@/app/ui/user/headerCustomer/headerMain";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header></Header>
      <main className="flex  items-center justify-center my-auto">
        <div className="relative w-full">{children}</div>
      </main>
    </div>
  );
}
