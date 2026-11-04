import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/store";
import FeedbackForm from "@/components/FeedbackForm";
import { Brand } from "@/components/Brand";

export const metadata: Metadata = { title: "Rate this session · ENSAM MATHS" };

async function Feedback({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const session = await getSession(id);
  if (!session) notFound();

  return (
    <>
      <p className="animate-rise text-sm font-medium text-gold-bright">
        Session feedback
      </p>
      <h1 className="animate-rise mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl [animation-delay:60ms]">
        {session.title}
      </h1>
      <div className="animate-rise mt-8 [animation-delay:120ms]">
        {session.open ? (
          <FeedbackForm sessionId={session.id} />
        ) : (
          <p className="rounded-lg bg-white p-6 text-muted shadow-2xl">
            This session is closed and no longer accepting feedback. Thanks
            anyway!
          </p>
        )}
      </div>
    </>
  );
}

export default function Page(props: PageProps<"/s/[id]">) {
  return (
    <main className="math-surface relative flex-1">
      <div className="relative mx-auto w-full max-w-xl px-5 py-8 sm:py-14">
        <Brand tone="light" size="lg" />
        <div className="mt-10 sm:mt-14">
          <Suspense
            fallback={
              <div className="space-y-4" aria-busy>
                <div className="h-3 w-40 animate-pulse rounded bg-white/15" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-white/15" />
                <div className="mt-8 h-96 animate-pulse rounded-lg bg-white/10" />
              </div>
            }
          >
            <Feedback params={props.params} />
          </Suspense>
        </div>
        <p className="mt-8 text-sm text-white/60">
          Responses are anonymous. No name or account is collected.
        </p>
      </div>
    </main>
  );
}
