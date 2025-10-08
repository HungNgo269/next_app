"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { ActionResult } from "next/dist/server/app-render/types";

export async function authenticate(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const redirectUrl = (formData.get("redirectTo") as string) || "/";
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: redirectUrl,
    });
    return {
      error: null,
      messsage: "Login Successful, redirecting",
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials. Check your email and password",
            email: formData.get("email") as string,
          };
        default:
          return {
            error: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}
