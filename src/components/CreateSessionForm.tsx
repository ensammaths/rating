"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createSessionAction } from "@/lib/actions";

export default function CreateSessionForm() {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await createSessionAction(fd);
        ref.current?.reset();
      }}
      className="flex flex-col gap-2 rounded-md bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row"
    >
      <label htmlFor="title" className="sr-only">
        Session name
      </label>
      <input
        id="title"
        name="title"
        required
        maxLength={120}
        autoComplete="off"
        placeholder="Session name, e.g. Week 3 · Intro to SQL"
        className="min-w-0 flex-1 rounded-sm px-3 py-3 text-base text-ink outline-none placeholder:text-slate-400"
      />
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-sm bg-gold px-6 py-3 font-bold text-navy-deep transition hover:bg-gold-bright active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create link"}
    </button>
  );
}
