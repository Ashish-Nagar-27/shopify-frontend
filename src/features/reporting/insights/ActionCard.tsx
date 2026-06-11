import { cn } from '@/lib/utils';
import type { Action, PriorityKey } from '@/lib/types';
import * as Icon from '@/components/icons';

const TAG_LABEL: Record<string, string> = {
  scale: 'SCALE', pause: 'PAUSE', refresh: 'REFRESH', rebalance: 'REBALANCE',
};

const TAG_ICONS: Record<string, React.ReactNode> = {
  scale: <Icon.arrowUp width="11" height="11" />,
  pause: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1"/>
      <rect x="14" y="5" width="4" height="14" rx="1"/>
    </svg>
  ),
  refresh: <Icon.refresh width="11" height="11" />,
  rebalance: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h14M17 8l4 4-4 4M21 12H7M7 16l-4-4 4-4"/>
    </svg>
  ),
};

const TAG_CLS: Record<string, string> = {
  scale:     'bg-[oklch(0.80_0.16_155/0.16)] text-pos',
  pause:     'bg-[oklch(0.70_0.20_25/0.16)] text-neg',
  refresh:   'bg-[oklch(0.82_0.15_80/0.16)] text-warn',
  rebalance: 'bg-cyan-soft text-cyan',
};

const srcBase = 'w-[22px] h-[22px] rounded-[6px] inline-grid place-items-center font-bold text-[11px] text-white flex-shrink-0';

function SrcIconInline({ src }: { src: string | null }) {
  if (src === 'fb') return <span className={`${srcBase} bg-[linear-gradient(135deg,#1877F2,#0a4fb0)]`} title="Meta Ads">f</span>;
  if (src === 'go') return <span className={`${srcBase} bg-[linear-gradient(135deg,#ea4335,#fbbc04_50%,#34a853)]`} title="Google Ads">G</span>;
  if (src === 'tt') return <span className={`${srcBase} bg-black shadow-[0_0_0_1px_#555_inset]`} title="TikTok Ads">𝕋</span>;
  return <span className={`${srcBase} bg-surface-2 text-fg-mute text-[10px]`}>⇄</span>;
}

function PriorityDots({ p }: { p: PriorityKey }) {
  const n = p === 'high' ? 3 : p === 'med' ? 2 : 1;
  const title = p === 'high' ? 'High priority' : p === 'med' ? 'Medium priority' : 'Low priority';
  return (
    <span className="inline-flex gap-[3px] items-center" title={title}>
      {[1, 2, 3].map(i => (
        <span key={i} className={cn(
          'w-[5px] h-[5px] rounded-full',
          i <= n
            ? p === 'high' ? 'bg-neg shadow-[0_0_6px_var(--neg)]'
            : p === 'med'  ? 'bg-warn'
            : 'bg-fg-faint'
            : 'bg-surface-hi',
        )} />
      ))}
    </span>
  );
}

interface Props {
  a: Action;
  onApply: (id: string, action: string) => void;
  applied: boolean;
  snoozed: boolean;
}

export function ActionCard({ a, onApply, applied, snoozed }: Props) {
  return (
    <div className={cn(
      'flex flex-col bg-bg-deep border border-border-soft rounded-[10px] overflow-hidden relative transition-[border-color] duration-150 hover:border-border',
      applied && 'opacity-55',
      snoozed && 'opacity-45',
    )}>
      <div className="flex items-center justify-between p-3 pt-3 pb-0">
        <div className={cn('inline-flex items-center gap-[5px] px-[9px] py-[5px] rounded-[6px] text-[10px] font-bold tracking-[0.10em] w-max', TAG_CLS[a.kind])}>
          {TAG_ICONS[a.kind]}
          <span>{TAG_LABEL[a.kind]}</span>
        </div>
        <PriorityDots p={a.priority} />
      </div>

      <div className="p-3 pb-[14px] flex-1 flex flex-col gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <SrcIconInline src={a.source} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="text-[13px] font-semibold text-fg leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis">
              {a.title}
            </div>
            <div className="text-[10px] text-fg-faint font-mono tracking-[0.04em] mt-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
              {a.parent}
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-[10px] py-[6px] bg-surface border border-border-soft rounded-[7px] w-max max-w-full">
          <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-fg-mute">{a.trigger.label}</span>
          <span className={cn('font-mono font-bold text-[13px]', a.trigger.positive ? 'text-pos' : 'text-neg')}>
            {a.trigger.value}
          </span>
          <span className="font-mono text-[10px] text-fg-mute pl-2 border-l border-border-soft">{a.trigger.trend}</span>
        </div>

        <p className="m-0 text-[12px] text-fg-dim leading-[1.5]">{a.reason}</p>
      </div>

      <div className="px-[14px] py-3 bg-bg-overlay border-t border-border-soft flex flex-col gap-[6px]">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-fg-mute">Action</span>
          <span className="font-mono text-[13px] font-semibold text-fg">{a.suggested}</span>
        </div>
        <div className={cn(
          'font-mono text-[11px] font-semibold leading-[1.4] pb-1 border-b border-dashed border-border-soft mb-1',
          a.impactPositive ? 'text-pos' : a.impactPositive === false ? 'text-neg' : 'text-fg-mute',
        )}>
          {a.impact}
        </div>

        {applied ? (
          <div className="inline-flex items-center gap-[6px] h-8 px-3 bg-[oklch(0.80_0.16_155/0.14)] text-pos rounded-[7px] text-[12px] font-semibold justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5 9-11"/>
            </svg>
            Applied
          </div>
        ) : snoozed ? (
          <div className="inline-flex items-center gap-[6px] h-8 px-3 bg-[oklch(0.80_0.16_155/0.14)] rounded-[7px] text-[12px] font-semibold justify-center text-fg-mute">
            Snoozed 24h
          </div>
        ) : (
          <div className="flex gap-[6px]">
            <button
              className="flex-1 h-8 rounded-[7px] text-[12px] font-semibold inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] hover:brightness-[1.08] transition-[filter] duration-150"
              onClick={() => onApply(a.id, 'apply')}>
              Apply
            </button>
            <button
              className="w-8 h-8 rounded-[7px] text-[12px] font-semibold inline-flex items-center justify-center bg-surface border border-border-soft text-fg-mute hover:text-fg hover:border-border transition-all duration-150"
              onClick={() => onApply(a.id, 'snooze')}
              title="Snooze 24h">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 2"/>
                <circle cx="12" cy="12" r="9"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
