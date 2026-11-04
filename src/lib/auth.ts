import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminCookie } from "./auth-token";

export async function isAdmin() {
  const jar = await cookies();
  return isValidAdminCookie(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/login");
}
