import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: UserRole;
      image_url?: string;

      createdAt?: string;
      updatedAt?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role?: UserRole;
    image_url?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}
