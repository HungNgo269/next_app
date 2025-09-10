import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./lib/definitions";
import { getToken } from "next-auth/jwt";
//claudeAI code lại cho sạch routeConfig
interface RouteConfig {
  requireAuth?: boolean;
  allowedRoles?: string[] | null;
  redirectUnauth?: string;
  redirectUnauthorized?: string;
  redirectIfAuth?: boolean;
  getRedirectUrl?: (user: User) => string;
}

const routeConfig: Record<string, RouteConfig> = {
  "/dashboard": {
    requireAuth: true,
    allowedRoles: ["admin"],
    redirectUnauth: "/login",
    redirectUnauthorized: "/",
  },
  "/user": {
    requireAuth: true,
    allowedRoles: null, // All authenticated users
    redirectUnauth: "/login",
  },
  "/login": {
    redirectIfAuth: true,
    getRedirectUrl: (user: User) =>
      user?.role === "admin" ? "/dashboard" : "/",
  },
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  const publicPaths = [
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/images",
    "/icons",
    "/manifest.json",
    "/",
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return response;
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const user = token as User | null;

  const matchedRoute = Object.keys(routeConfig).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const config = routeConfig[matchedRoute];

    if (config.redirectIfAuth && token) {
      const redirectUrl = config.getRedirectUrl
        ? config.getRedirectUrl(user!)
        : "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    if (config.requireAuth && !token) {
      const redirectUrl = config.redirectUnauth || "/login";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    if (config.allowedRoles && token) {
      const hasValidRole = config.allowedRoles.includes(user?.role || "");
      if (!hasValidRole) {
        const redirectUrl = config.redirectUnauthorized || "/";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }
  }

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
