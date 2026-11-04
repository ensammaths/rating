import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/auth-actions";

/** Club logo + wordmark, styled after ensammath.com. */
export function Brand({
  tone = "dark",
  size = "md",
  href,
}: {
  tone?: "dark" | "light";
  size?: "md" | "lg";
  href?: string;
}) {
  const lg = size === "lg";
  const body = (
    <span className="flex items-center gap-3 sm:gap-4">
      <Image
        src="/logo.png"
        alt="ENSAM MATHS logo"
        width={lg ? 72 : 48}
        height={lg ? 72 : 48}
        priority
        className={`rounded-full shadow-lg ${lg ? "ring-4 ring-white/10" : ""}`}
      />
      <span
        className={`border-l pl-3 sm:pl-4 ${tone === "light" ? "border-white/20" : "border-line"}`}
      >
        <span
          className={`block font-bold tracking-tight ${lg ? "text-xl sm:text-2xl" : "text-lg"} ${
            tone === "light" ? "text-white" : "text-navy"
          }`}
        >
          ENSAM <span className="text-gold">MATHS</span>
        </span>
        <span
          className={`block text-xs font-medium uppercase tracking-wide ${
            tone === "light" ? "text-white/70" : "text-muted"
          }`}
        >
          Club scientifique
        </span>
      </span>
    </span>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

/** White top bar used on the admin pages. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <Brand href="/" />
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="hidden border-b-2 border-gold pb-0.5 font-semibold text-navy sm:block"
          >
            Dashboard
          </Link>
          <form action={logout}>
            <button className="rounded-sm border border-line px-3 py-1.5 font-medium text-muted hover:border-navy hover:text-navy">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
