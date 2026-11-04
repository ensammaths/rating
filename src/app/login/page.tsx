import type { Metadata } from "next";
import { Brand } from "@/components/Brand";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Admin login · ENSAM MATHS" };

export default function LoginPage() {
  return (
    <main className="math-surface flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Brand tone="light" size="lg" />
        <div className="mt-10 rounded-lg bg-white p-6 text-ink shadow-2xl shadow-black/30 sm:p-8">
          <h1 className="text-xl font-bold text-navy">Admin login</h1>
          <p className="mt-1 text-sm text-muted">
            Enter the password to see the dashboard and results.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
