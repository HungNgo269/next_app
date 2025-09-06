import { cache } from "react";
import { auth } from "@/auth";

export const getSessionCache = cache(async () => {
  const session = await auth();
  return session;
});
