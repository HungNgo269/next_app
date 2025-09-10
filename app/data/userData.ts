import { sql } from "../../lib/db";
import User from "@/app/interface/user";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = (await sql`SELECT * FROM users WHERE email=${email}`) as unknown as User[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export async function getUserID(email: string) {
  try {
    const rows = (await sql`SELECT id FROM users WHERE email=${email}`) as unknown as { id: string }[];
    return rows.map((r) => r.id);
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
