import type { NextAuthConfig } from "next-auth";
import { getUser, upsertUserOAuth } from "./app/data/userData";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          let dbUser: any = await getUser(user.email!);

          if (!dbUser) {
            dbUser = await upsertUserOAuth({
              email: user.email!,
              name: user.name!,
              google_id: user.id || account.providerAccountId,
              image_url: user.image || "",
            });
          }

          return true; // Cho phép sign in
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false; // Từ chối sign in
        }
      }

      return true; // Cho phép sign in với các provider khác
    },

    async jwt({ token, user, account, profile }) {
      // Chỉ chạy lần đầu khi user sign in
      if (user) {
        const dbUser = await getUser(user.email!);
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.role = dbUser.role || "user";
          token.image_url = dbUser.image_url || user.image || "";
          token.createdAt = dbUser.created_at;
          token.updatedAt = dbUser.updated_at;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.image_url = token.image_url as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
