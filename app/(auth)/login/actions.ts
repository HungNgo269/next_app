"use server";

import { signIn } from "@/auth";
import { getURL } from "@/lib/utils/helper";
import { getUser } from "@/app/data/userData";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const submittedRedirect = (formData.get("redirectTo") as string) || "/dashboard";
    const email = (formData.get("email") as string) || "";

    // Default to dashboard only for admins; others go home.
    let redirectTo = submittedRedirect;
    if (!submittedRedirect || submittedRedirect === "/dashboard") {
      try {
        const user = (await getUser(email)) as any;
        redirectTo = user?.role === "admin" ? "/dashboard" : "/";
      } catch {
        // If we can't look up the user, be safe and send to home.
        redirectTo = "/";
      }
    }

    const absoluteRedirect = getURL(redirectTo);
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: absoluteRedirect,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
