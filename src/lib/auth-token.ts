// Shared by proxy.ts and server code. Uses Web Crypto so it runs anywhere.

export const ADMIN_COOKIE = "fb_admin";

/** Cookie value for the current ADMIN_PASSWORD. Changing the password logs everyone out. */
export async function adminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  return password ? tokenFor(password) : null;
}

export async function tokenFor(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("ensam-feedback-admin-v1"),
  );
  return Array.from(new Uint8Array(sig), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True if the cookie value grants admin access. Locally, no password = open. */
export async function isValidAdminCookie(value: string | undefined) {
  const expected = await adminToken();
  if (!expected) return process.env.NODE_ENV !== "production";
  return !!value && safeEqual(value, expected);
}
