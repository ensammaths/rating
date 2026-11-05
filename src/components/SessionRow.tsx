"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { SessionSummary } from "@/lib/store";
import { deleteSessionAction, toggleSessionAction } from "@/lib/actions";
import ShareButtons from "./ShareButtons";
import { fmtDate } from "@/lib/format";

export default function SessionRow({
  session: s,
  baseUrl,
}: {
  session: SessionSummary;
  baseUrl: string | null;
}) {
  const [pending, start] = useTransition();

  return (
    <li
      className={`group rounded-lg border border-line bg-white p-4 transition hover:border-navy/30 hover:shadow-lg hover:shadow-navy/5 sm:p-5 ${
        pending ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/results/${s.id}`}
              className="truncate text-lg font-bold text-navy hover:text-gold"
            >
              {s.title}
            </Link>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                s.open
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-muted"
              }`}
            >
              {s.open ? "Open" : "Closed"}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted">{fmtDate(s.createdAt)}</p>
        </div>

        <Link
          href={`/results/${s.id}`}
          className="flex items-baseline gap-4 rounded-xl px-1 text-right"
        >
          <span>
            <span className="block text-2xl font-bold tabular-nums text-gold">
              {s.average ? s.average.toFixed(1) : "–"}
            </span>
            <span className="text-xs text-muted">avg</span>
          </span>
          <span>
            <span className="block text-2xl font-bold tabular-nums text-navy">
              {s.count}
            </span>
            <span className="text-xs text-muted">
              {s.count === 1 ? "response" : "responses"}
            </span>
          </span>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <ShareButtons id={s.id} title={s.title} baseUrl={baseUrl} />
        <Link
          href={`/results/${s.id}`}
          className="rounded-sm border border-line px-3 py-1.5 font-medium text-navy hover:border-navy"
        >
          View results
        </Link>
        <span className="flex-1" />
        <button
          onClick={() => start(() => toggleSessionAction(s.id, !s.open))}
          className="rounded-sm px-3 py-1.5 text-muted hover:bg-slate-100 hover:text-ink"
        >
          {s.open ? "Close" : "Reopen"}
        </button>
        <button
          onClick={() => {
            if (
              confirm(
                `Delete "${s.title}" and its ${s.count} responses? This can't be undone.`,
              )
            )
              start(() => deleteSessionAction(s.id));
          }}
          className="rounded-sm px-3 py-1.5 text-muted hover:bg-red-50 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
