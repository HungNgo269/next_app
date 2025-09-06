import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getUser } from "./app/data/userData";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt", //accesstoken
    maxAge: 15 * 60,
  },
  //rf token
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          if (!email || !password) {
            console.log("Email or password is missing");
            return null;
          }
          const user = await getUser(email);
          if (!user) return null;

          if (!user.password) {
            console.log("User password is not set in database");
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          } else {
            console.log("Password doesn't match");
            return null;
          }
        }

        console.log("Invalid credentials format");
        return null;
      },
    }),
  ],
});
export const { GET, POST } = handlers;
