import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  const publicPaths = [
    "/api/auth",
    "/api/public",
    "/_next",
    "/favicon.ico",
    "/images",
    "/icons",
    "/manifest.json",
    "/login",
    "/register",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return response;
  }
  const token = await getToken({
    req: req,
    secret: process.env.AUTH_SECRET,
  });
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return response;
  }
  if (pathname === "/login") {
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return response;
  }

  if (pathname.includes("/chapter/") && pathname.includes("/book/")) {
    response.headers.set("x-requires-subscription-check", "true");
  }

  if (token) {
    response.headers.set("x-user-role", token?.role || "");
    response.headers.set("x-user-id", token?.id?.toString() || "");
  }
  return response;
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
