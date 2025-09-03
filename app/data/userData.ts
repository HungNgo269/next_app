import { sql } from "../../lib/db";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user: User[] = await sql`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
