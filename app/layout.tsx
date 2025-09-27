import "@/app/globals.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import ClientProviders from "@/components/clientProvider";
import CronInitializer from "@/app/ui/cronIni";
import { getSessionCache } from "@/lib/utils/getSession";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Next Book",
    default: "Next Book",
  },
  description: "Every book that you need, light weight and no ad website",
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionCache();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased font-normal `}
      >
        <CronInitializer />
        <ClientProviders session={session}>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
