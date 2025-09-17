import { sql } from "@/lib/db";
import { User, UserProfile } from "@/app/interface/user";
import { UserStripe } from "@/app/interface/userStripe";
import { auth } from "@/auth";

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
      (await sql`update userstripe set stripe_customer_id=${stripe_customer_id} WHERE id=${id}`) as UserStripe[];
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

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  try {
    const rows = (await sql`
        SELECT
          id,
          name,
          email,
          role,
          phone,
          image_url,
          address,
          created_at,
          updated_at
        FROM users
        WHERE id = ${id}
        LIMIT 1
      `) as unknown as UserProfile[];
    return rows[0] ?? null;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user profile.");
  }
}

export async function updateUserProfile(
  id: string,
  updates: {
    name: string;
    phone?: string | null;
    address?: string | null;
  }
): Promise<UserProfile> {
  try {
    const rows = (await sql`
        UPDATE users
        SET
          name = ${updates.name},
          phone = ${updates.phone ?? null},
          address = ${updates.address ?? null},
          updated_at = now()
        WHERE id = ${id}
        RETURNING
          id,
          name,
          email,
          role,
          phone,
          image_url,
          address,
          created_at,
          updated_at
      `) as unknown as UserProfile[];

    if (!rows[0]) {
      throw new Error("User not found");
    }

    return rows[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update user profile.");
  }
}
export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    return await getUserProfile(session.user.id);
  } catch (error) {
    console.error("Failed to fetch current user profile:", error);
    return null;
  }
}
export async function upsertUserOAuth({
  email,
  name,
  google_id,
  image_url,
}: {
  email: string;
  name?: string | null;
  google_id?: string | null;
  image_url?: string | null;
}) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, google_id, image_url) 
      VALUES (${email}, ${name}, ${google_id}, ${image_url})
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        google_id = EXCLUDED.google_id,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
      RETURNING id, email, name, avatar_url, created_at
    `;

    return result[0];
  } catch (error) {
    console.error("Failed to upsert user OAuth:", error);
    return null;
  }
}
