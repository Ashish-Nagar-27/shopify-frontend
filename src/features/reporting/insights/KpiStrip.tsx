import { KPIS } from '@/lib/data';
import { MiniSpark } from './MiniSpark';
import * as Icon from '@/components/icons';

export function KpiStrip() {
  return (
    <div className="grid grid-cols-5 gap-[14px] max-[1400px]:gap-[10px] max-[1100px]:grid-cols-3">
      {KPIS.map((t, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-2 px-[18px] py-4 bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-mute">
              {t.label}
            </span>
            <MiniSpark seed={t.seed} positive={t.pos} />
          </div>

          <div className="text-[26px] max-[1400px]:text-[22px] tracking-[-0.02em] font-semibold tabular-nums text-fg">
            {t.unit && (
              <span className="text-[14px] text-fg-mute mr-[3px] font-medium">{t.unit}</span>
            )}
            {t.val}
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] text-fg-mute font-mono">
            <span className={[
              'inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[6px]',
              t.pos ? 'text-pos bg-pos-soft' : 'text-neg bg-neg-soft',
            ].join(' ')}>
              {t.pos
                ? <Icon.arrowUp width="9" height="9" />
                : <Icon.arrowDown width="9" height="9" />}
              {t.delta}
            </span>
            <span className="text-fg-faint">{t.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
