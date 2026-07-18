import type { DrillState, TabKey } from '@/lib/types';

interface ReportDrillBreadcrumbProps {
  drill: DrillState | null;
  tab: TabKey;
  onClearDrill: () => void;
}

export function ReportDrillBreadcrumb({
  drill,
  tab,
  onClearDrill,
}: ReportDrillBreadcrumbProps) {
  if (!drill || drill.targetTab !== tab) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 px-5 py-[10px] bg-bg-overlay border-b border-border-soft text-[12px]">
      <span className="text-fg-mute font-medium text-[11px] tracking-[0.08em] uppercase">
        Filtered from {drill.fromTab === 'campaign' ? 'Campaign' : 'Ad set'}:
      </span>
      {drill.labels.slice(0, 3).map((l, i) => (
        <span
          key={i}
          className="inline-flex items-center px-[10px] py-1 bg-cyan-soft text-cyan rounded-full text-[12px] font-medium"
        >
          {l}
        </span>
      ))}
      {drill.labels.length > 3 && (
        <span className="inline-flex items-center px-[10px] py-1 bg-cyan-soft text-cyan rounded-full text-[12px] font-medium">
          +{drill.labels.length - 3} more
        </span>
      )}
      <button
        className="inline-flex items-center gap-[5px] px-[10px] py-1 ml-auto bg-transparent border border-border-soft rounded-full text-fg-mute text-[12px] hover:text-fg hover:border-border transition-[color,border-color] duration-[120ms]"
        onClick={onClearDrill}
        title="Clear filter"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
        Show all
      </button>
    </div>
  );
}
