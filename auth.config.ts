import type { NextAuthConfig } from "next-auth";
import UserToken from "./app/interface/session";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "update") {
        //f5 nếu cần
      }
      if (user) {
        const userData = user as UserToken;
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name;
        token.role = userData.role;
        token.image_url = userData?.image_url;
        token.createdAt = userData.created_at;
        token.updatedAt = userData.updated_at;
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
