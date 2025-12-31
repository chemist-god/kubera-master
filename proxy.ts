import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, SESSION_CONFIG } from "@/lib/utils/constants";

// Next.js expects a `proxy` export (or default) to run on every request.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_CONFIG.COOKIE_NAME);

  // Check if route is protected
  const isProtectedRoute = ROUTES.PROTECTED.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route (login/register)
  const isAuthRoute = ROUTES.AUTH.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
