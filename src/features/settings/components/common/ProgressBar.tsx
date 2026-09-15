interface ProgressBarProps {
  /** Value used, defaults to 0 if not provided (API data can be unpredictable). */
  used?: number;
  /** Max value; when falsy or 0 the bar renders empty rather than dividing by zero. */
  limit?: number;
}

/** Thin gradient progress bar used across usage cards and plan cards. */
export function ProgressBar({ used, limit }: ProgressBarProps) {
  const safeUsed = used ?? 0;
  const safeLimit = limit ?? 0;
  const pct = safeLimit > 0 ? Math.min(100, Math.round((safeUsed / safeLimit) * 100)) : 0;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-hi)]">
      <div
        className="h-full rounded-full bg-[image:var(--gradient-accent)] transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
