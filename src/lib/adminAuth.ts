import { NextRequest } from "next/server";
import crypto from "crypto";

export function isValidAdminSession(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  if (!cookie || !process.env.ADMIN_PASSWORD) return false;

  const expected = crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD)
    .digest("hex");

  return cookie === expected;
}
