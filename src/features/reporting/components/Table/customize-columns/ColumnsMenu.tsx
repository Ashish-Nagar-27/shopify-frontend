import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { COLUMN_PRESETS } from '@/lib/data';
import * as Icon from '@/components/icons';

interface Props {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  currentPreset: string;
  onApplyPreset: (name: string) => void;
  onCustomise: () => void;
}

export function ColumnsMenu({ open, anchorRef, onClose, currentPreset, onApplyPreset, onCustomise }: Props) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="absolute right-0 top-[calc(100%+6px)] z-[30] w-[240px] bg-bg-deep border border-border rounded-[10px] shadow-[0_18px_40px_-12px_oklch(0_0_0/0.6)] overflow-hidden p-[6px] flex flex-col gap-1"
      ref={ref}>
      <div className="flex items-center justify-between px-[10px] py-2 pb-[6px] text-[10px] font-semibold tracking-[0.14em] text-fg-mute">
        <span>POPULAR</span>
        <Icon.chevronDown width="12" height="12" style={{ color: 'var(--fg-mute)' }} />
      </div>

      <div className="flex flex-col">
        {Object.keys(COLUMN_PRESETS).map(p => (
          <button
            key={p}
            className="flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] text-[13px] font-medium text-fg text-left transition-[background] duration-[120ms] hover:bg-surface"
            onClick={() => { onApplyPreset(p); onClose(); }}>
            <span className={cn(
              'w-4 h-4 rounded-full border-[1.5px] grid place-items-center flex-shrink-0 transition-[border-color] duration-[120ms]',
              currentPreset === p ? 'border-cyan' : 'border-border',
            )}>
              <span className={cn(
                'w-2 h-2 rounded-full transition-[background] duration-[120ms]',
                currentPreset === p && 'bg-cyan shadow-[0_0_6px_var(--cyan)]',
              )} />
            </span>
            <span>{p}</span>
          </button>
        ))}
      </div>

      <button
        className="flex items-center justify-center gap-2 p-[10px] mt-1 rounded-[7px] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] text-[13px] font-semibold"
        onClick={() => { onCustomise(); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h13M4 12h9M4 18h13M19 6h.01M19 12h.01M19 18h.01"/>
        </svg>
        Customise Columns
      </button>
    </div>
  );
}
