import { Skeleton } from "@/components/ui/skeleton";
import { useFacebookCreativeData } from "../hooks/useCreativeData";
import { SparkleIcon } from "../icons/Icon";
import { CrThumb } from "./CrThumb";

const KIND_STYLES: Record<string, { border: string; tag: string; stat: string }> = {
  scale: { border: "border-t-pos", tag: "bg-pos-soft text-pos", stat: "text-pos" },
  refresh: { border: "border-t-warn", tag: "bg-warn-soft text-warn", stat: "text-warn" },
  kill: { border: "border-t-neg", tag: "bg-neg-soft text-neg", stat: "text-neg" },
};

export function ActionCards() {
  const { data, isLoading } = useFacebookCreativeData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-border-soft bg-surface px-5 py-[18px] shadow-card"
          >
            <Skeleton className="h-5 w-20 bg-surface-2" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-surface-2" />
              <Skeleton className="h-5 w-48 bg-surface-2" />
            </div>
            <Skeleton className="h-10 w-full bg-surface-2" />
            <div className="mt-auto flex items-center justify-between border-t border-dashed border-border-soft pt-2.5">
              <Skeleton className="h-5 w-24 bg-surface-2" />
              <Skeleton className="h-4 w-32 bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-3">

      {data?.actions?.map((a, i) => {
        const s = KIND_STYLES[a.kind] || KIND_STYLES.scale;
        return (
          <div
            key={i}
            className={`flex flex-col gap-2.5 rounded-xl border-t-2 bg-surface px-5 py-[18px] shadow-card ${s.border}`}
          >
            <span className={`inline-flex w-max items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.11em] ${s.tag}`}>
              <SparkleIcon width={10} height={10} />
              {a?.kind?.toUpperCase()}
            </span>
            <div className="flex items-center gap-3">
              <CrThumb c={a} />
              <span className="text-sm font-semibold leading-[1.35] text-fg">{a?.headline}</span>
            </div>
            <p className="m-0 text-xs leading-[1.55] text-fg-dim">{a?.body}</p>
            <div className="mt-auto flex items-baseline gap-1.5 border-t border-dashed border-border-soft pt-2.5">
              <span className={`font-mono text-base font-bold ${s.stat}`}>{a?.impact_label}</span>
              <span className="text-[11px] text-fg-mute">{a?.impact_value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
