import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself through
  if (pathname === "/admin/login") return NextResponse.next();

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const cookie = req.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_PASSWORD
    ? crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest("hex")
    : null;

  if (!cookie || !expected || cookie !== expected) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
