import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/auth-token";

// Keep the dashboard and results behind the admin password.
// Student links (/s/...) stay public.
export async function proxy(request: NextRequest) {
  const ok = await isValidAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!ok) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/results/:path*"],
};
