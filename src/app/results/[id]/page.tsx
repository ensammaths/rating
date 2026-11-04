import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getResponses, getSession } from "@/lib/store";
import { RATINGS } from "@/lib/ratings";
import { Stars } from "@/components/Stars";
import ShareButtons from "@/components/ShareButtons";
import AutoRefresh from "@/components/AutoRefresh";
import { fmtDate, fmtLongDate, fmtTime } from "@/lib/format";
import { TopBar } from "@/components/Brand";

async function Results({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [session, responses] = await Promise.all([
    getSession(id),
    getResponses(id),
  ]);
  if (!session) notFound();

  const count = responses.length;
  const avg = count
    ? responses.reduce((s, r) => s + r.rating, 0) / count
    : null;
  const dist = RATINGS.map((r) => ({
    ...r,
    n: responses.filter((x) => x.rating === r.value).length,
  })).reverse();
  const max = Math.max(1, ...dist.map((d) => d.n));
  const withText = responses
    .filter((r) => r.liked || r.improve)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <section className="math-surface relative">
        <div className="relative mx-auto w-full max-w-5xl px-5 pt-8 pb-24 sm:pt-10">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-gold-bright"
          >
            ← All sessions
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gold-bright">
                Results · {session.open ? "Open" : "Closed"}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                {session.title}
              </h1>
              <p className="mt-2 text-white/70">
                {fmtLongDate(session.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <ShareButtons id={session.id} title={session.title} />
              {count > 0 && (
                <a
                  href={`/results/${session.id}/csv`}
                  className="rounded-sm border border-white/30 px-3 py-1.5 font-medium text-white hover:border-gold hover:text-gold-bright"
                >
                  Export CSV
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16">
        <section className="-mt-12 grid gap-3 sm:grid-cols-[240px_1fr] sm:gap-4">
          <div className="rounded-lg border border-line bg-white p-6 shadow-xl shadow-navy/5">
            <p className="text-sm text-muted">Average rating</p>
            <p className="mt-2 text-6xl font-bold tabular-nums text-gold">
              {avg ? avg.toFixed(1) : "–"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {count} {count === 1 ? "response" : "responses"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-6 shadow-xl shadow-navy/5">
            <p className="text-sm text-muted">Distribution</p>
            <ul className="mt-3 space-y-1.5">
              {dist.map((d) => (
                <li key={d.value} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0">
                    <Stars value={d.value} className="size-3.5" />
                  </span>
                  <span className="h-3 flex-1 overflow-hidden rounded-sm bg-paper">
                    <span
                      className={`block h-full rounded-sm transition-[width] duration-500 ${d.value >= 4 ? "bg-navy" : d.value === 3 ? "bg-gold" : "bg-red-400"}`}
                      style={{ width: `${(d.n / max) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right tabular-nums text-muted">
                    {d.n}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-navy">
            Comments ({withText.length})
          </h2>
          {withText.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center text-muted">
              {count === 0
                ? "No feedback yet. Share the link or QR code at the end of the session."
                : "Responses so far have a rating only, no comments."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {withText.map((r, i) => {
                const meta = RATINGS[r.rating - 1];
                return (
                  <li
                    key={`${r.createdAt}-${i}`}
                    className="rounded-lg border border-line border-l-4 border-l-navy bg-white p-5"
                  >
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span className="flex items-center gap-2">
                        <Stars value={r.rating} />
                        {meta?.label}
                      </span>
                      <time>
                        {fmtDate(r.createdAt)} · {fmtTime(r.createdAt)}
                      </time>
                    </div>
                    {r.liked && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-navy">Liked</p>
                        <p className="mt-1 whitespace-pre-wrap">{r.liked}</p>
                      </div>
                    )}
                    {r.improve && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-amber-700">
                          To improve
                        </p>
                        <p className="mt-1 whitespace-pre-wrap">{r.improve}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

export default function Page(props: PageProps<"/results/[id]">) {
  return (
    <>
      <TopBar />
      <Suspense
        fallback={
          <>
            <div className="math-surface h-64" />
            <div className="mx-auto -mt-12 h-72 w-full max-w-5xl animate-pulse rounded-lg bg-line/70 px-5" />
          </>
        }
      >
        <Results params={props.params} />
      </Suspense>
      <AutoRefresh seconds={10} />
    </>
  );
}
