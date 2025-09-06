import type { NextAuthConfig } from "next-auth";

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
      if (user) {
        const user1 = user as UserToken;
        token.id = user1.id;
        token.email = user1.email;
        token.name = user1.name;
        token.role = user1.role;
        token.createdAt = user1.created_at;
        token.updatedAt = user1.updated_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
