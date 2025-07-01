import type { NextAuthConfig } from "next-auth";
import { User } from "@/app/lib/definitions";
import { getToken, type JWT } from "next-auth/jwt";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    // JWT callback - runs whenever JWT is created, updated, or accessed
    async jwt({ token, user }) {
      //gán data
      if (user) {
        const user1 = user as User;
        token.id = user1.id;
        token.email = user1.email;
        token.name = user1.name;
        token.role = user1.role;
        token.createdAt = user1.created_at;
        token.updatedAt = user1.updated_at;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
