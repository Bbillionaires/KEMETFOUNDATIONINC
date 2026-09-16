import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;
    const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    if (isAdminRoute && role !== "ADMIN" && role !== "SUPERADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/membership/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: "/membership/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/member/:path*",
    "/api/events/:id/register",
  ],
};
