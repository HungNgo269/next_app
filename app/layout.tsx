import "@/app/globals.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import ClientProviders from "@/components/clientProvider";
import { auth } from "@/auth";
import CronInitializer from "./ui/cronIni";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme Dashboard",
    default: "Acme Dashboard",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased font-normal `}>
        <CronInitializer />

        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
