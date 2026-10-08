import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "rsvp_admin";
export const ADMIN_PATH = "/rsvp/responses";

const password = () => process.env.ADMIN_PASSWORD ?? "";

export const adminConfigured = () => password().length > 0;

// The cookie holds a hash of the password, so changing ADMIN_PASSWORD signs everyone out.
const token = (secret: string) => createHmac("sha256", secret).update("rsvp-admin").digest("hex");

function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  return same(value, token(password()));
}

export async function signIn(attempt: string) {
  if (!adminConfigured() || !same(token(attempt), token(password()))) return false;
  (await cookies()).set(COOKIE, token(password()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: ADMIN_PATH,
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: ADMIN_PATH });
}
