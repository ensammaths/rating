const PATH =
  "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z";

export function Star({
  filled,
  className = "",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d={PATH}
        strokeWidth={1.5}
        strokeLinejoin="round"
        className={`transition-colors duration-150 ${
          filled ? "fill-gold stroke-gold" : "fill-transparent stroke-slate-300"
        }`}
      />
    </svg>
  );
}

/** Read-only row of 5 stars. */
export function Stars({
  value,
  className = "size-4",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= value} className={className} />
      ))}
    </span>
  );
}
