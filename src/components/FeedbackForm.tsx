"use client";

import { useEffect, useState, useTransition } from "react";
import { submitFeedback } from "@/lib/actions";
import { RATINGS } from "@/lib/ratings";
import { Star } from "./Stars";

const doneKey = (id: string) => `feedback-done:${id}`;

export default function FeedbackForm({ sessionId }: { sessionId: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  // Remember (only on this device) that feedback was already sent.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(doneKey(sessionId))) setDone(true);
  }, [sessionId]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      setError("Tap a star to rate the session.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await submitFeedback(sessionId, { rating, liked, improve });
      if (res.ok) {
        localStorage.setItem(doneKey(sessionId), "1");
        setDone(true);
      } else {
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-lg bg-white px-6 py-12 text-center text-ink shadow-2xl shadow-black/30">
        <div
          className="animate-pop mx-auto flex size-20 items-center justify-center rounded-full bg-navy text-4xl font-bold text-gold"
          aria-hidden
        >
          ✓
        </div>
        <h2 className="animate-rise mt-5 text-2xl font-bold text-navy">
          Thanks for your feedback!
        </h2>
        <p className="animate-rise mt-2 text-muted [animation-delay:80ms]">
          Your response has been recorded anonymously.
        </p>
      </div>
    );
  }

  const selected = RATINGS.find((r) => r.value === rating);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 rounded-lg bg-white p-5 text-ink shadow-2xl shadow-black/30 sm:p-8"
    >
      <fieldset>
        <legend className="font-semibold text-navy">
          How was the session?
        </legend>
        <div
          role="radiogroup"
          aria-label="Rating"
          className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2"
          onMouseLeave={() => setHover(null)}
        >
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={rating === r.value}
              aria-label={`${r.value} star${r.value > 1 ? "s" : ""}, ${r.label}`}
              onMouseEnter={() => setHover(r.value)}
              onClick={() => {
                setRating(r.value);
                setError(null);
              }}
              className="rounded-md p-1 transition-transform duration-150 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Star
                filled={r.value <= (hover ?? rating ?? 0)}
                className="size-11 sm:size-12"
              />
            </button>
          ))}
          <span
            className={`basis-full pl-1 text-sm font-medium ${(hover ?? rating) ? "text-navy" : "text-muted"}`}
            aria-live="polite"
          >
            {RATINGS.find((r) => r.value === (hover ?? rating))?.label ??
              "Tap to rate"}
          </span>
        </div>
      </fieldset>

      <Field
        id="liked"
        label="What did you like?"
        placeholder={
          selected && selected.value <= 2
            ? "Anything at all that worked?"
            : "The parts that clicked for you…"
        }
        value={liked}
        onChange={setLiked}
      />
      <Field
        id="improve"
        label="What didn't work, or should be improved?"
        placeholder="Pace, clarity, examples, anything…"
        value={improve}
        onChange={setImprove}
      />

      {error && (
        <p
          role="alert"
          className="animate-rise text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold py-4 text-base font-bold text-navy-deep transition-all hover:bg-gold-bright active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}

function Field(props: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="font-semibold text-navy">
        {props.label}{" "}
        <span className="text-sm font-normal text-muted">(optional)</span>
      </label>
      <textarea
        id={props.id}
        rows={3}
        maxLength={2000}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="mt-2 block w-full resize-y rounded-md border border-line bg-paper px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/10"
      />
    </div>
  );
}
