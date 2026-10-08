import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "revio-super-secret-jwt-key-min-32-chars-long-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set security headers on all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Admin routes & redirect routes must not be indexed by search engines
  if (pathname.startsWith("/admin") || pathname.startsWith("/r/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Check protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isAdminRoute || isDashboardRoute) {
    const token = request.cookies.get("revio_session")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const userRole = payload.role as string;

      if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return response;
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/r/:path*"],
};
