import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./lib/definitions";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Tạo response mặc định và luôn thêm x-pathname header
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Bỏ qua auth check cho các route tĩnh và API
  const publicPaths = [
    "/api",
    "/_next",
    "/favicon.ico",
    "/images",
    "/icons",
    "/manifest.json",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return response;
  }

  const token = await getToken({
    req: req,
    secret: process.env.AUTH_SECRET,
  });

  const user = token as User | null;

  // const authConfig = {
  //   "/dashboard": {
  //     requireAuth: true,
  //     allowedRoles: ["admin"],
  //     redirectUnauth: "/login",
  //     redirectUnauthorized: "/",
  //   },
  //   "/user/": {
  //     requireAuth: true,
  //     allowedRoles: null,
  //     redirectUnauth: "/login",
  //   },
  //   "/login": {
  //     redirectIfAuth: true,
  //     getRedirectUrl: (user: User) =>
  //       user?.role === "admin" ? "/dashboard" : "/",
  //   },
  // };

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return response;
  }

  if (pathname.startsWith("/user/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return response;
  }

  if (pathname === "/login" && token) {
    const redirectUrl = user?.role === "admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // if (token) {
  //   response.headers.set("x-user-role", user?.role || "");
  //   response.headers.set("x-user-id", user?.id?.toString() || "");
  // }

  return response;
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
