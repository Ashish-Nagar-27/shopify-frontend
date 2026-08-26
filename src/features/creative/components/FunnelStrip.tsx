import { useMemo } from "react";
import { useFacebookCreativeData } from "../hooks/useCreativeData";
import type { ApiFunnelData, FunnelStage } from "../types/creative";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_CONFIGS: Array<{
  key: keyof ApiFunnelData;
  n: number;
  label: string;
  hint: string;
}> = [
  { key: "hook", n: 1, label: "Hook rate", hint: "3-sec views ÷ impressions" },
  { key: "hold", n: 2, label: "Hold rate", hint: "ThruPlays ÷ 3-sec views" },
  { key: "ctr", n: 3, label: "CTR", hint: "link clicks ÷ impressions" },
  { key: "cvr", n: 4, label: "CVR", hint: "purchases ÷ link clicks" },
];

const DEFAULT_STAGES: FunnelStage[] = STAGE_CONFIGS.map((cfg) => ({
  n: cfg.n,
  label: cfg.label,
  val: "0%",
  pct: 0,
  bench: "0%",
  good: true,
  hint: cfg.hint,
}));

export function FunnelStrip() {
  const { data, isLoading } = useFacebookCreativeData();

  const rawFunnel = data?.funnel;

  const funnelStages: FunnelStage[] = useMemo(() => {
    if (
      !rawFunnel ||
      (!rawFunnel.hook && !rawFunnel.ctr && !rawFunnel.hold && !rawFunnel.cvr)
    ) {
      return DEFAULT_STAGES;
    }

    return STAGE_CONFIGS.map((cfg) => {
      const metric = rawFunnel[cfg.key];
      if (!metric) {
        return {
          n: cfg.n,
          label: cfg.label,
          val: "0%",
          pct: 0,
          bench: "0%",
          good: true,
          hint: cfg.hint,
        };
      }

      const valFormatted = metric.value.toFixed(2);
      const benchFormatted = metric.benchmark.toFixed(2);
      const good = !metric.leak;
      const pct = metric.benchmark || 0;

      return {
        n: cfg.n,
        label: cfg.label,
        val: valFormatted,
        pct,
        bench: benchFormatted,
        good,
        hint: cfg.hint,
        leak: metric.leak,
      };
    });
  }, [rawFunnel]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-soft bg-surface shadow-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <Skeleton className="h-4 w-48 bg-surface-2" />
          <Skeleton className="h-7 w-56 rounded-[10px] bg-surface-2" />
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 p-5 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-24 bg-surface-2" />
              <Skeleton className="h-8 w-28 bg-surface-2" />
              <Skeleton className="h-3 w-32 bg-surface-2" />
              <Skeleton className="h-1.5 w-full bg-surface-2 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-soft bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
        <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
          Creative Funnel · <span className="text-cyan">Where attention leaks</span>
        </h3>
        <span className="inline-flex h-7 items-center rounded-[10px] border border-border-soft bg-surface px-3 font-mono text-[11px] text-fg-dim">
          Account avg · vs category benchmark
        </span>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4">
        {funnelStages.map((s, i) => {
          const isOdd = i % 2 === 1;
          const isSecondRow = i >= 2;
          return (
            <div
              key={s.n}
              title={s.hint}
              className={
                "relative flex flex-col gap-2 border-border-soft px-[22px] py-[18px] " +
                (isOdd ? "border-l " : "") +
                (isSecondRow ? "border-t " : "") +
                (i === 0 ? "xl:border-l-0 " : "xl:border-l ") +
                "xl:border-t-0"
              }
            >
              {s.leak && (
                <span className="absolute right-3.5 top-3.5 rounded-md bg-neg-soft px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.1em] text-neg">
                  Leak
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-fg-mute">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-surface-2 font-mono text-[9px] font-semibold text-fg-dim">
                  {s.n}
                </span>
                {s.label}
              </span>
              <span className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-fg [font-variant-numeric:tabular-nums]">
                {s.val}%
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-fg-faint">bench {s.bench}</span>
                <span className={s.good ? "text-pos" : "text-neg"}>{s.good ? "above" : "below"}</span>
              </span>
              <span className="mt-1 h-1 overflow-hidden rounded-sm bg-surface-2">
                <span
                  className="block h-full rounded-sm"
                  style={{ width: `${s.pct}%`, background: s.good ? "var(--pos)" : "var(--neg)" }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
