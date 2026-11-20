import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnAdmin = req.nextUrl.pathname.startsWith("/dashboard/admin");
    const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (isOnAuth && token) {
      const role = (token as any).role;
      return NextResponse.redirect(new URL(role === "ADMIN" ? "/dashboard/admin" : "/dashboard/member", req.url));
    }

    if (isOnDashboard && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isOnAdmin && token) {
      const role = (token as any).role;
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/member", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
        const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
        
        if (isOnAuth) return true; // Allow access to auth pages
        if (isOnDashboard) return !!token; // Require auth for dashboard
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};