"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "./themeProvider";

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      {/* {children} */}
    </SessionProvider>
  );
}
