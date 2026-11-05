import { Suspense } from "react";
import { connection } from "next/server";
import { listSessions, usingMemoryStore } from "@/lib/store";
import { requireAdmin } from "@/lib/auth";
import { publicOrigin } from "@/lib/site";
import CreateSessionForm from "@/components/CreateSessionForm";
import SessionRow from "@/components/SessionRow";
import AutoRefresh from "@/components/AutoRefresh";
import { TopBar } from "@/components/Brand";

async function Sessions() {
  await connection();
  await requireAdmin();
  const sessions = await listSessions();

  const total = sessions.reduce((n, s) => n + s.count, 0);
  const overall = total
    ? sessions.reduce((sum, s) => sum + (s.average ?? 0) * s.count, 0) / total
    : null;

  return (
    <>
      <dl className="-mt-12 grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Sessions" value={sessions.length} />
        <Stat label="Responses" value={total} />
        <Stat
          label="Avg rating"
          value={overall ? overall.toFixed(1) : "–"}
          hint="/ 5"
          gold
        />
      </dl>

      {usingMemoryStore && (
        <p className="mt-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Running without a database: data lives in memory and is lost on
          restart. Connect Upstash Redis on Vercel to persist it (see README).
        </p>
      )}

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-navy">Your sessions</h2>
        {sessions.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center text-muted">
            No sessions yet. Create one above to get a feedback link.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} baseUrl={publicOrigin()} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({
  label,
  value,
  hint,
  gold,
}: {
  label: string;
  value: string | number;
  hint?: string;
  gold?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-5 shadow-xl shadow-navy/5 sm:px-6">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={`mt-2 text-3xl font-bold tabular-nums sm:text-4xl ${gold ? "text-gold" : "text-navy"}`}
      >
        {value}
        {hint && value !== "–" && (
          <span className="ml-1 text-sm font-medium text-muted">{hint}</span>
        )}
      </dd>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <TopBar />
      <section className="math-surface relative">
        <div className="relative mx-auto w-full max-w-5xl px-5 pt-12 pb-24 sm:pt-16">
          <h1 className="text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            Session <span className="text-gold">feedback</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Create a link for each session, share it at the end, and read the
            anonymous results here.
          </p>
          <div className="mt-8 max-w-2xl">
            <CreateSessionForm />
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16">
        <Suspense
          fallback={
            <div className="-mt-12 h-64 animate-pulse rounded-lg bg-line/70" />
          }
        >
          <Sessions />
        </Suspense>
      </main>
      <AutoRefresh seconds={15} />
    </>
  );
}
