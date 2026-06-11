import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ACTIONS } from '@/lib/data';
import { ActionCard } from './ActionCard';
import * as Icon from '@/components/icons';

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'scale',     label: 'Scale' },
  { key: 'pause',     label: 'Pause' },
  { key: 'refresh',   label: 'Refresh' },
  { key: 'rebalance', label: 'Rebalance' },
];

export function ActionCenter() {
  const [filter, setFilter] = useState('all');
  const [state, setState]   = useState<Record<string, string>>({});
  const [open, setOpen]     = useState(false);

  const filtered = useMemo(
    () => ACTIONS.filter(a => filter === 'all' || a.kind === filter),
    [filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ACTIONS.length };
    ACTIONS.forEach(a => { c[a.kind] = (c[a.kind] || 0) + 1; });
    return c;
  }, []);

  const summary = useMemo(() => {
    let netDaily = 0, opportunities = 0;
    ACTIONS.forEach(a => {
      if (state[a.id] === 'apply' || state[a.id] === 'snooze') return;
      opportunities++;
      const m = a.impact.match(/[+−-]?₹?([\d,]+)/);
      if (!m) return;
      const v = parseInt(m[1].replace(/,/g, ''), 10);
      const isWeekly = /wk|week/.test(a.impact);
      netDaily += isWeekly ? v / 7 : v;
    });
    return { netDaily: Math.round(netDaily), opportunities };
  }, [state]);

  const onApply = (id: string, action: string) =>
    setState(s => ({ ...s, [id]: action }));

  const breakdown = [
    { key: 'scale',     label: 'Scale',     count: counts.scale     || 0, color: 'var(--pos)'  },
    { key: 'pause',     label: 'Pause',     count: counts.pause     || 0, color: 'var(--neg)'  },
    { key: 'refresh',   label: 'Refresh',   count: counts.refresh   || 0, color: 'var(--warn)' },
    { key: 'rebalance', label: 'Rebalance', count: counts.rebalance || 0, color: 'var(--cyan)' },
  ];

  return (
    <div className="flex flex-col bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)]">
      <button
        className={cn(
          'flex items-center justify-between gap-[18px] w-full px-5 py-[14px] bg-transparent text-left cursor-pointer transition-[background] duration-150 hover:bg-[oklch(0.20_0.022_235/0.5)]',
          open && 'border-b border-border-soft',
        )}
        onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <span className={cn('inline-flex text-fg-mute transition-transform duration-200', open && 'rotate-90 text-cyan')}>
            <Icon.chevron width="14" height="14" />
          </span>
          <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-fg-mute m-0">Action Center</h3>
          <span className="inline-flex items-center gap-[6px] px-[10px] py-1 bg-cyan-soft text-cyan rounded-full text-[11px]">
            <span className="w-[5px] h-[5px] rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)] [animation:pulse_2s_ease-in-out_infinite]" />
            <b className="font-mono font-bold">{summary.opportunities}</b> open
          </span>
        </div>

        <div className="inline-flex items-center gap-1 flex-1 justify-center max-[1400px]:hidden">
          {breakdown.map(b => (
            <span key={b.key} className="inline-flex items-center gap-[6px] px-[10px] py-1 rounded-[6px] text-[11px] text-fg-dim" title={`${b.count} ${b.label}`}>
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: b.color }} />
              <span className="text-fg-mute">{b.label}</span>
              <span className="font-mono font-bold text-fg">{b.count}</span>
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-[14px]">
          <span className="inline-flex flex-col items-end leading-[1.2]">
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-fg-mute">Net projected</span>
            <span className="font-mono text-[13px] font-bold mt-[2px] text-pos">+₹{summary.netDaily.toLocaleString()}/day</span>
          </span>
          <span className="text-[11px] text-cyan font-semibold tracking-[0.04em] px-[10px] py-[6px] rounded-[6px] bg-cyan-soft">
            {open ? 'Collapse' : 'Review'}
          </span>
        </div>
      </button>

      {open && (
        <>
          <div className="flex items-center justify-between gap-3 px-5 pt-[14px]">
            <div className="inline-flex items-center gap-1 p-[3px] bg-bg-deep rounded-[9px] border border-border-soft">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={cn(
                    'inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px] text-[12px] font-medium text-fg-mute transition-all duration-150 hover:text-fg-dim',
                    filter === f.key && 'bg-surface-hi text-fg shadow-[0_1px_0_oklch(1_0_0/0.05)_inset,0_1px_4px_oklch(0_0_0/0.2)]',
                  )}
                  onClick={() => setFilter(f.key)}>
                  {f.label}
                  <span className={cn(
                    'font-mono text-[10px] px-[5px] py-[1px] rounded-[4px] font-semibold',
                    filter === f.key ? 'bg-cyan-soft text-cyan' : 'bg-surface-2 text-fg-mute',
                  )}>
                    {counts[f.key] || 0}
                  </span>
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-[6px] px-[7px] py-[5px] rounded-[6px] text-[12px] font-medium text-fg-mute transition-all duration-150 hover:text-fg-dim" title="More options">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.6"/>
                <circle cx="12" cy="12" r="1.6"/>
                <circle cx="19" cy="12" r="1.6"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-4 max-[1400px]:grid-cols-2 max-[1100px]:grid-cols-1 gap-[14px] px-5 py-[18px]">
            {filtered.slice(0, 4).map(a => (
              <ActionCard
                key={a.id}
                a={a}
                onApply={onApply}
                applied={state[a.id] === 'apply'}
                snoozed={state[a.id] === 'snooze'} />
            ))}
          </div>

          {filtered.length > 4 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft text-[12px] text-fg-mute">
              <span>
                Showing 4 of <b style={{ color: 'var(--fg-dim)' }}>{filtered.length}</b>{' '}
                {filter !== 'all' ? FILTERS.find(f => f.key === filter)!.label.toLowerCase() : 'active'} recommendations
              </span>
              <button className="inline-flex items-center gap-1 text-cyan text-[12px] font-semibold">
                View all <Icon.chevron width="11" height="11" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
