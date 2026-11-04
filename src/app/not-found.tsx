import { Brand } from "@/components/Brand";

export default function NotFound() {
  return (
    <main className="math-surface relative flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative">
        <div className="flex justify-center">
          <Brand tone="light" size="lg" />
        </div>
        <h1 className="mt-12 text-2xl font-bold">Link not found</h1>
        <p className="mt-2 max-w-sm text-white/70">
          This feedback link doesn&apos;t exist or was deleted. Check with your
          instructor.
        </p>
      </div>
    </main>
  );
}
