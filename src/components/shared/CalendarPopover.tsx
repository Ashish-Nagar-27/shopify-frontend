import { useState, useRef, useEffect } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { DayPicker, type DateRange as RdpRange } from 'react-day-picker';
import { cn, fmtDate } from '@/lib/utils';
import * as Icon from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

 interface DateRange { start: Date; end: Date; }

/**
 * What `onApply` hands back to you when the user clicks "Apply".
 * `previousPeriod` is the equal-length window immediately before the
 * selected range (only computed when the Compare toggle is on).
 */
export interface AppliedRange {
  start: Date;
  end: Date;
  compare: boolean;
  previousPeriod: { start: Date; end: Date } | null;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function today() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

const atMidnight = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const DAY = 86_400_000;

/* ------------------------------------------------------------------ *
 * Day cell (shadcn-style custom DayButton override for react-day-picker)
 * Reads the active modifiers and paints the cyan range exactly like the
 * original hand-rolled grid (solid endpoints, soft middle, hover preview,
 * today dot, faded/disabled future days).
 * ------------------------------------------------------------------ */

type DayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: { date: Date };
  modifiers: Record<string, boolean>;
};

function CalendarDayButton({ day, modifiers: m, className, ...props }: DayButtonProps) {
  const single = m.range_start && m.range_end;
  // `preview_end` is treated as a real endpoint (solid), just like the
  // original `isHoverEnd`.
  const solid = m.range_start || m.range_end || m.preview_end;
  const middle = (m.range_middle || m.preview) && !solid;
  const isToday = m.today;

  return (
    <button
      {...props}
      className={cn(
        'h-[30px] w-full grid place-items-center text-[12px] rounded-[6px] relative font-mono transition-[background,color] duration-[120ms] text-fg-dim',
        m.disabled && 'text-fg-faint opacity-30 cursor-not-allowed',
        middle && 'bg-cyan-soft text-cyan rounded-none',
        solid && 'bg-cyan text-bg-deep font-bold z-[1]',
        solid &&
          (single
            ? 'rounded-[6px]'
            : m.range_start
              ? 'rounded-l-[6px] rounded-r-none'
              : 'rounded-r-[6px] rounded-l-none'),
        !solid && !middle && !m.disabled && 'hover:bg-surface hover:text-fg',
        className,
      )}
    >
      {day.date.getDate()}
      {isToday && (
        <span
          className={cn(
            'absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full',
            solid ? 'bg-bg-deep' : 'bg-cyan',
          )}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Popover
 * ------------------------------------------------------------------ */

interface CalendarPopoverProps {
  open: boolean;
  onClose: () => void;
  value: DateRange;
  /** Called with the applied range (+ compare info) when the user clicks Apply. */
  onApply: (r: AppliedRange) => void;
}

export function CalendarPopover({ open, onClose, value, onApply }: CalendarPopoverProps) {
  const [range, setRange] = useState<RdpRange | undefined>({ from: value.start, to: value.end });
  const [hoverDay, setHoverDay] = useState<Date | null>(null);
  const [month, setMonth] = useState(new Date(value.start.getFullYear(), value.start.getMonth(), 1));
  const [compare, setCompare] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Which field is "active" — drives the From/To highlight in the bar.
  const picking: 'start' | 'end' = range?.from && !range?.to ? 'end' : 'start';

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Reset to the incoming value each time the popover opens.
  useEffect(() => {
    if (open) {
      setRange({ from: value.start, to: value.end });
      setMonth(new Date(value.start.getFullYear(), value.start.getMonth(), 1));
      setHoverDay(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  /* ---- Hover preview (while picking the end of the range) ---- */
  const previewing = !!(range?.from && !range?.to && hoverDay);
  let previewFrom: Date | undefined;
  let previewTo: Date | undefined;
  if (previewing && range?.from && hoverDay) {
    const a = +range.from;
    const b = +hoverDay;
    previewFrom = new Date(Math.min(a, b));
    previewTo = new Date(Math.max(a, b));
  }

  const modifiers = {
    preview: previewing && previewFrom && previewTo ? { from: previewFrom, to: previewTo } : [],
    preview_end: previewing && hoverDay ? hoverDay : [],
  };

  const onDayMouseEnter = (date: Date) => {
    const d = atMidnight(date);
    if (+d > +today()) return; // never preview into disabled future days
    setHoverDay(d);
  };

  /* ---- Presets ---- */
  const applyPreset = (preset: string) => {
    const t = today();
    let s: Date;
    let e: Date = t;
    if (preset === 'today') { s = t; }
    else if (preset === 'yest') { s = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1); e = s; }
    else if (preset === '7d') { s = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 6); }
    else if (preset === '14d') { s = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 13); }
    else if (preset === '28d') { s = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 27); }
    else if (preset === '30d') { s = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 29); }
    else if (preset === 'thisM') { s = new Date(t.getFullYear(), t.getMonth(), 1); }
    else if (preset === 'lastM') { s = new Date(t.getFullYear(), t.getMonth() - 1, 1); e = new Date(t.getFullYear(), t.getMonth(), 0); }
    else if (preset === 'ytd') { s = new Date(t.getFullYear(), 0, 1); }
    else { s = t; }
    setRange({ from: s, to: e });
    setMonth(new Date(s.getFullYear(), s.getMonth(), 1));
    setHoverDay(null);
  };

  /* ---- Apply: build the payload you act on ---- */
  const apply = () => {
    if (!range?.from) return;
    const start = atMidnight(range.from);
    const end = atMidnight(range.to ?? range.from);

    let previousPeriod: { start: Date; end: Date } | null = null;
    if (compare) {
      const lenDays = Math.round((+end - +start) / DAY) + 1;
      const prevEnd = new Date(start);
      prevEnd.setDate(prevEnd.getDate() - 1);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - (lenDays - 1));
      previousPeriod = { start: atMidnight(prevStart), end: atMidnight(prevEnd) };
    }

    onApply({ start, end, compare, previousPeriod });
    onClose();
  };

  const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

  const presets = [
    { k: 'today', l: 'Today' }, { k: 'yest', l: 'Yesterday' },
    { k: '7d', l: 'Last 7 days' }, { k: '14d', l: 'Last 14 days' },
    { k: '28d', l: 'Last 28 days' }, { k: '30d', l: 'Last 30 days' },
    { k: 'thisM', l: 'This month' }, { k: 'lastM', l: 'Last month' },
    { k: 'ytd', l: 'Year to date' },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] z-[50] flex bg-bg-deep border border-border rounded-[14px] shadow-[0_24px_60px_-16px_oklch(0_0_0/0.7),0_0_0_1px_oklch(0_0_0/0.3)] overflow-hidden"
    >
      {/* Presets sidebar */}
      <div className="w-[158px] bg-[oklch(0.105_0.018_240)] border-r border-border-soft px-[10px] py-[14px] flex flex-col gap-[2px]">
        <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-mute px-2 pb-2 pt-1">
          Quick ranges
        </div>
        {presets.map(p => (
          <button
            key={p.k}
            className="text-left px-[10px] py-2 rounded-[6px] text-[12px] text-fg-dim transition-[background,color] duration-150 hover:bg-surface hover:text-fg"
            onClick={() => applyPreset(p.k)}
          >
            {p.l}
          </button>
        ))}
      </div>

      {/* Calendar body */}
      <div className="px-4 py-[14px] pb-3 flex flex-col gap-[10px] min-w-[540px]">
        {/* Nav + range display */}
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 grid place-items-center rounded-[6px] text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms]"
            onClick={() => setMonth(prevMonth)}
            title="Previous month"
          >
            <Icon.chevron width="14" height="14" style={{ transform: 'rotate(180deg)' }} />
          </button>

          <div className="flex-1 flex items-center justify-center gap-[14px] px-[10px] py-[6px] bg-surface rounded-[8px]">
            <div className={cn('flex flex-col p-1 px-2 rounded-[6px] flex-1 items-center', picking === 'start' && 'bg-cyan-soft outline outline-1 outline-cyan-deep')}>
              <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-fg-mute">From</span>
              <span className={cn('font-mono text-[12px] font-semibold mt-[2px]', picking === 'start' ? 'text-cyan' : 'text-fg')}>
                {fmtDate(range?.from ?? null)}
              </span>
            </div>
            <span className="text-fg-faint font-mono">→</span>
            <div className={cn('flex flex-col p-1 px-2 rounded-[6px] flex-1 items-center', picking === 'end' && 'bg-cyan-soft outline outline-1 outline-cyan-deep')}>
              <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-fg-mute">To</span>
              <span className={cn('font-mono text-[12px] font-semibold mt-[2px]', picking === 'end' ? 'text-cyan' : 'text-fg')}>
                {range?.to ? fmtDate(range.to) : <span className="text-fg-faint">Pick end…</span>}
              </span>
            </div>
          </div>

          <button
            className="w-7 h-7 grid place-items-center rounded-[6px] text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms]"
            onClick={() => setMonth(nextMonth)}
            title="Next month"
          >
            <Icon.chevron width="14" height="14" />
          </button>
        </div>

        {/* Two-month grid (react-day-picker) */}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(r) => { setRange(r); setHoverDay(null); }}
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={2}
          weekStartsOn={0}
          showOutsideDays={false}
          hideNavigation
          disabled={{ after: today() }}
          onDayMouseEnter={onDayMouseEnter}
          modifiers={modifiers}
          components={{ DayButton: CalendarDayButton }}
          formatters={{
            formatWeekdayName: (d) => d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
          }}
          classNames={{
            months: 'flex gap-6',
            month: 'flex flex-col gap-[6px]',
            nav: 'hidden',
            month_caption: 'flex items-center justify-center h-[18px] mb-[6px]',
            caption_label: 'text-[12px] font-semibold text-fg tracking-[0.02em]',
            month_grid: 'border-collapse',
            weekday: 'text-[10px] font-semibold text-fg-faint pb-1 tracking-[0.04em] w-[34px] h-[26px]',
            day: 'p-[1px] text-center align-middle w-[34px]',
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-[10px] border-t border-border-soft mt-1">
          <span className="flex items-center gap-[10px] text-[12px] text-fg-dim">
            <Switch
              checked={compare}
              onCheckedChange={setCompare}
              className="data-[state=checked]:bg-cyan"
            />
            Compare to <b>previous period</b>
          </span>
          <div className="flex gap-[10px]">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 bg-surface border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium hover:text-fg hover:border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={apply}
              disabled={!range?.from}
              className="h-9 px-[18px] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] rounded-[8px] text-[13px] font-semibold hover:brightness-[1.08] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { DateRange };
export { today };

/* ------------------------------------------------------------------ *
 * Example usage — accessing the applied data:
 *
 * function Toolbar() {
 *   const [open, setOpen] = useState(false);
 *   const [value, setValue] = useState<DateRange>({ start: today(), end: today() });
 *
 *   return (
 *     <div className="relative">
 *       <button onClick={() => setOpen(true)}>Pick dates</button>
 *       <CalendarPopover
 *         open={open}
 *         onClose={() => setOpen(false)}
 *         value={value}
 *         onApply={(applied) => {
 *           // applied.start / applied.end       -> the chosen range
 *           // applied.compare                   -> compare toggle state
 *           // applied.previousPeriod            -> { start, end } | null
 *           setValue({ start: applied.start, end: applied.end });
 *           fetchMetrics(applied.start, applied.end, applied.previousPeriod);
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ------------------------------------------------------------------ */
