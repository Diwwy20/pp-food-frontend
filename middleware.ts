import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const pathWithoutLocale = pathname.replace(/^\/(th|en)/, "");

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];

  if (authRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const protectedRoutes = ["/profile", "/admin", "/cart"];

  if (protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    if (!refreshToken) {
      const loginUrl = new URL("/login", request.url);

      return NextResponse.redirect(loginUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/",
    "/(th|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
