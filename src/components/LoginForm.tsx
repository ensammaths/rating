"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1.5 block w-full rounded-md border border-line bg-paper px-4 py-3 text-base outline-none transition focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/10"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-sm bg-gold py-3 font-bold text-navy-deep transition hover:bg-gold-bright disabled:opacity-60"
      >
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
