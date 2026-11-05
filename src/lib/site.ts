/**
 * Public address used in student links and QR codes.
 * On Vercel this is the production domain, so links never point at a
 * deployment URL that is behind Vercel's login. SITE_URL overrides it
 * (e.g. a custom domain). Returns null locally: the browser origin is used.
 */
export function publicOrigin(): string | null {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return prod ? `https://${prod}` : null;
}
