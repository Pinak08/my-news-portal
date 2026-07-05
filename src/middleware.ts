import { NextRequest, NextResponse } from "next/server";

// Middleware runs on Vercel's Edge Runtime, which does NOT support Node's
// built-in `crypto` module — only the browser-style Web Crypto API
// (`crypto.subtle`, available globally, no import needed). This hashes the
// admin password the same way the login route does, using an Edge-safe API.
async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself through
  if (pathname === "/admin/login") return NextResponse.next();

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const cookie = req.cookies.get("admin_session")?.value;

  if (!cookie || !process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const expected = await sha256Hex(process.env.ADMIN_PASSWORD);

  if (cookie !== expected) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
