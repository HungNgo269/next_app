import { auth } from "./auth"; // import từ file bạn đã export NextAuth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./app/lib/definitions";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const user = token as User;
  if (user?.role === "admin" && pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (user?.role === "user" && pathname !== "/home") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
