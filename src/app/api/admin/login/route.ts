import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Simple single-admin session: no user accounts, no database table for
// auth. Your uncle enters one password (set in Vercel env vars), and if
// correct we set a signed, httpOnly cookie that middleware.ts checks on
// every /admin request.

function sessionToken() {
  // Derived from the password itself, so the token is valid only as long
  // as ADMIN_PASSWORD stays the same, and can't be guessed without it.
  return crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD || "")
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Server is missing ADMIN_PASSWORD. Set it in Vercel → Settings → Environment Variables." },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
