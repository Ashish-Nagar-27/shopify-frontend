interface Props {
  s: 'active' | 'paused' | 'off';
}

export function StatusBadge({ s }: Props) {
  if (s === 'active') return (
    <span className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[5px] text-[10px] font-semibold tracking-[0.06em] uppercase text-pos bg-pos-soft">
      <span className="w-[6px] h-[6px] rounded-full bg-pos shadow-[0_0_8px_var(--pos)]" />
      Active
    </span>
  );
  if (s === 'paused') return (
    <span className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[5px] text-[10px] font-semibold tracking-[0.06em] uppercase text-warn bg-[oklch(0.82_0.15_80/0.16)]">
      <span className="w-[6px] h-[6px] rounded-full bg-warn" />
      Paused
    </span>
  );
  return (
    <span className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[5px] text-[10px] font-semibold tracking-[0.06em] uppercase text-fg-faint bg-surface-2">
      <span className="w-[6px] h-[6px] rounded-full bg-fg-faint" />
      Off
    </span>
  );
}
