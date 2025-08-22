"use client";

import { SessionProvider } from "next-auth/react";
import { useHydrateAuth } from "@/app/store/useHydrateAuth";
import { Session } from "next-auth";
import { ThemeProvider } from "./themeProvider";

function HydrateWrapper() {
  useHydrateAuth();
  return null;
}

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <HydrateWrapper />
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider> */}
      {children}
    </SessionProvider>
  );
}
