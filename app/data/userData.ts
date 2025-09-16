import { User } from "next-auth";
import { sql } from "../../lib/db";
import { UserStripe } from "../interface/userStripe";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user =
      (await sql`SELECT * FROM users WHERE email=${email}`) as unknown as User[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export async function getUserID(email: string) {
  try {
    const rows =
      (await sql`SELECT id FROM users WHERE email=${email}`) as unknown as {
        id: string;
      }[];
    return rows.map((r) => r.id);
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export async function getUserStripe(
  id: string
): Promise<UserStripe | undefined> {
  try {
    const user =
      (await sql`SELECT * FROM userstripe WHERE id=${id}`) as unknown as UserStripe[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export async function updateUserStripe(
  id: string,
  stripe_customer_id: string
): Promise<UserStripe | undefined> {
  try {
    const user =
      (await sql`update userstripe set stripe_customer_id=${stripe_customer_id} WHERE id=${id}
        `) as UserStripe[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserStripeByCustomerId(
  stripe_customer_id: string
): Promise<UserStripe> {
  try {
    const user =
      (await sql`SELECT * FROM userstripe WHERE stripe_customer_id=${stripe_customer_id}`) as UserStripe[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
