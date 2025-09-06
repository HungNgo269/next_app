import { sql } from "../../lib/db";
import User from "../interface/user";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user: User[] = await sql`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export async function getUserID(email: string) {
  try {
    const userId: string[] =
      await sql`SELECT id FROM users WHERE email=${email}`;
    return userId;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
