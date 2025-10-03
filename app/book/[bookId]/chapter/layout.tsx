import FooterComponent from "@/app/ui/user/footer/footerComponent";

export default async function ChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <FooterComponent></FooterComponent>
    </div>
  );
}
