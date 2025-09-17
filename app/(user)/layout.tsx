import Header from "../ui/user/headerCustomer/headerMain";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
}
