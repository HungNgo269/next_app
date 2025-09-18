"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { updateUserProfile } from "@/app/data/userData";
import type { UserProfile } from "@/app/interface/user";
import { ProfileSchema, profileSchema } from "@/app/schema/profileSchema";

export type UpdateAccountPayload = {
  name: string;
  phone?: string | null;
  address?: string | null;
};

export type UpdateAccountResult =
  | { success: true; data: UserProfile; message?: string }
  | { success: false; error: string };

export async function updateAccountInfo(
  payload: UpdateAccountPayload
): Promise<UpdateAccountResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in to update your profile.",
      };
    }

    const parsed = profileSchema.safeParse({
      name: payload.name ?? "",
      phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
      address: payload.address?.trim() ? payload.address.trim() : undefined,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return {
        success: false,
        error: issue?.message ?? "Invalid profile data",
      };
    }

    const data: ProfileSchema = parsed.data;

    const updatedProfile = await updateUserProfile(session.user.id, {
      name: data.name,
      phone: data.phone ?? null,
      address: data.address ?? null,
    });

    if (!updatedProfile) {
      return {
        success: false,
        error: "Unable to update profile. Please try again.",
      };
    }

    revalidatePath("/account");

    return {
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update account info:", error);
    return {
      success: false,
      error: "Something went wrong while updating your profile.",
    };
  }
}
