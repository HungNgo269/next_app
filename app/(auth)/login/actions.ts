"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const redirectUrl = (formData.get("redirectTo") as string) || "/";
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: redirectUrl,
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
