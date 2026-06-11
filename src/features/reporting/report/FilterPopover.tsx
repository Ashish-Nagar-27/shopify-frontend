import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FILTER_OPTIONS, FILTER_DEFAULTS } from '@/lib/data';
import type { FilterState } from '@/lib/types';
import * as Icon from '@/components/icons';

interface DropdownOption { value: string; label: string; desc?: string; }

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
}

export function Dropdown({ value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative w-full" ref={ref}>
      <button
        className={cn(
          'flex items-center justify-between w-full h-9 px-3 bg-surface border border-border-soft rounded-[8px] text-fg text-[13px] transition-all duration-[120ms] hover:border-border',
          open && 'border-cyan-deep',
        )}
        onClick={() => setOpen(o => !o)}>
        <span>{current.label}</span>
        <Icon.chevronDown width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[50] bg-bg-deep border border-border rounded-[9px] shadow-[0_18px_40px_-12px_oklch(0_0_0/0.7)] p-[5px] flex flex-col max-h-[280px] overflow-y-auto">
          {options.map(o => (
            <button
              key={o.value}
              className={cn(
                'flex items-center gap-[10px] px-[10px] py-[9px] rounded-[6px] text-left text-fg-dim transition-[background] duration-[120ms] hover:bg-surface hover:text-fg',
                o.value === value && 'bg-cyan-soft text-cyan',
              )}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <div style={{ flex: 1 }}>
                <span className="text-[13px] font-medium">{o.label}</span>
                {o.desc && <div className="text-[11px] text-fg-mute leading-[1.35]">{o.desc}</div>}
              </div>
              {o.value === value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5 9-11"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterPopoverProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  value: FilterState;
  onApply: (v: FilterState) => void;
}

export function FilterPopover({ open, anchorRef, onClose, value, onApply }: FilterPopoverProps) {
  const [local, setLocal] = useState<FilterState>(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setLocal(value); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  const changed = JSON.stringify(local) !== JSON.stringify(FILTER_DEFAULTS);

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-[40] w-[520px] bg-bg-deep border border-border rounded-[14px] shadow-[0_24px_60px_-16px_oklch(0_0_0/0.7)] overflow-hidden" ref={ref}>
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-border-soft">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.filter width="14" height="14" style={{ color: 'var(--cyan)' }} />
          <span className="text-[14px] font-semibold text-fg">Filter</span>
          {changed && <span className="w-[6px] h-[6px] rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" title="Settings differ from default" />}
        </div>
        <button
          className="w-[30px] h-[30px] rounded-[7px] grid place-items-center text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms]"
          onClick={onClose}
          title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m6 6 12 12M6 18 18 6"/>
          </svg>
        </button>
      </div>

      <div className="px-4 py-[14px] flex flex-col gap-3">
        {[
          { key: 'clickHandling' as const, label: 'Click Handling',      hint: 'How to treat clicks before attribution' },
          { key: 'window'        as const, label: 'Window Attribution',   hint: 'Lookback window for conversions' },
          { key: 'model'         as const, label: 'Attribution Model',    hint: 'How credit is split across touches' },
          { key: 'event'         as const, label: 'Conversion Event',     hint: 'Which event to attribute against' },
        ].map(({ key, label, hint }) => (
          <div key={key} className="grid grid-cols-[160px_1fr] items-center gap-4">
            <div className="flex flex-col gap-[2px]">
              <label className="text-[13px] font-semibold text-fg">{label}</label>
              <span className="text-[11px] text-fg-mute">{hint}</span>
            </div>
            <Dropdown
              value={local[key]}
              options={FILTER_OPTIONS[key]}
              onChange={(v) => setLocal(l => ({ ...l, [key]: v }))} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-[10px] px-4 py-3 border-t border-border-soft bg-bg-overlay">
        <button
          className="h-9 px-4 bg-surface border border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium hover:text-fg hover:border-border transition-[color,border-color] duration-[120ms]"
          onClick={() => setLocal(FILTER_DEFAULTS)}>
          Clear
        </button>
        <button
          className="h-9 px-[18px] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] rounded-[8px] text-[13px] font-semibold hover:brightness-[1.08] transition-[filter] duration-[120ms]"
          onClick={() => { onApply(local); onClose(); }}>
          Apply Attributes
        </button>
      </div>
    </div>
  );
}
