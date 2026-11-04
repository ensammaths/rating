"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, safeEqual, tokenFor } from "./auth-token";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const expected = await adminToken();
  if (!expected)
    return {
      error:
        "No admin password is set on the server. Add ADMIN_PASSWORD in Vercel and redeploy.",
    };

  const attempt = await tokenFor(String(formData.get("password") ?? ""));
  if (!safeEqual(attempt, expected)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "Wrong password." };
  }

  (await cookies()).set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/login");
}
