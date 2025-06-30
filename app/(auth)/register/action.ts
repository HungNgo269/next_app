"use server";
import { registerUser } from "@/app/lib/auth/register";
import registerSchema from "@/app/lib/validation/registerSchema";

export async function registerAction(
  prevState: string | undefined,
  formData: FormData
) {
  const parsed = registerSchema.safeParse({
    id: formData.get("id"),
    email: formData.get("email"),
    name: formData.get("name"),
    userName: formData.get("userName"),
    passWord: formData.get("passWord"),
    dateOfBirth: formData.get("dateOfBirth"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  registerUser(parsed.data);
}
