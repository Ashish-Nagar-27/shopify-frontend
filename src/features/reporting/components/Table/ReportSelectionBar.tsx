import * as Icon from '@/components/icons';
import type { TabKey } from '@/lib/types';

interface ReportSelectionBarProps {
  tab: TabKey;
  selIds: string[];
  selSummary: { spend: number; rev: number; sales: number } | null;
  onDrillTo: (target: TabKey) => void;
  onClearSelection: () => void;
}

export function ReportSelectionBar({
  tab,
  selIds,
  selSummary,
  onDrillTo,
  onClearSelection,
}: ReportSelectionBarProps) {
  if (selIds.length === 0) return null;

  

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[linear-gradient(90deg,var(--cyan-soft),oklch(0.72_0.20_340/0.08))] border-b border-[oklch(0.82_0.14_200/0.30)] border-t border-t-[oklch(0.82_0.14_200/0.20)] [animation:sel-in_0.15s_ease]">
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-[6px] text-[13px] text-fg font-medium">
          <span className="inline-grid place-items-center min-w-6 h-[22px] px-[6px] bg-cyan text-[oklch(0.10_0.018_240)] rounded-[6px] font-mono font-bold text-[12px]">
            {selIds.length}
          </span>
          {tab === 'campaign' ? ' campaign' : ' ad set'}{selIds.length > 1 ? 's' : ''} selected
        </span>
        {selSummary && (
          <span className="inline-flex items-center gap-[10px] text-[12px] text-fg-dim pl-4 border-l border-[oklch(0.82_0.14_200/0.25)]">
            <span>
              <span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Spend</span>{' '}
              <b className="text-fg font-mono font-bold">{selSummary.spend.toLocaleString()}</b>
            </span>
            <span className="text-fg-faint">·</span>
            <span>
              <span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Rev</span>{' '}
              <b className="text-fg font-mono font-bold">{selSummary.rev.toLocaleString()}</b>
            </span>
            <span className="text-fg-faint">·</span>
            <span>
              <span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Orders</span>{' '}
              <b className="text-fg font-mono font-bold">{selSummary.sales}</b>
            </span>
          </span>
        )}
      </div>
      <div className="inline-flex items-center gap-2">
        {tab === 'campaign' && (
          <>
            <button
              className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan"
              onClick={() => onDrillTo('adset')}
            >
              <Icon.adset width="13" height="13" /> View Ad sets <Icon.chevron width="11" height="11" />
            </button>
            <button
              className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan"
              onClick={() => onDrillTo('ad')}
            >
              <Icon.ad width="13" height="13" /> View Ads <Icon.chevron width="11" height="11" />
            </button>
          </>
        )}
        {tab === 'adset' && (
          <button
            className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan"
            onClick={() => onDrillTo('ad')}
          >
            <Icon.ad width="13" height="13" /> View Ads <Icon.chevron width="11" height="11" />
          </button>
        )}
        <button
          className="inline-flex items-center gap-[6px] h-8 px-3 bg-transparent border border-border-soft rounded-[7px] text-fg-mute font-normal text-[12px] transition-all duration-[120ms] hover:text-neg hover:border-neg"
          onClick={onClearSelection}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
          Clear
        </button>
      </div>
    </div>
  );
}
