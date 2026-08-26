import { memo } from "react";

interface TrendSparkProps {
  vals: number[];
}

export const TrendSpark = memo(function TrendSpark({ vals }: TrendSparkProps) {
  if (!Array.isArray(vals) || vals.length === 0) {
    return <div className="h-[26px] w-[84px]" />;
  }
  const W = 84, H = 26;
  const up = vals[vals.length - 1] >= vals[0];
  const color = up ? "var(--pos)" : "var(--warn)";
  const max = Math.max(...vals), min = Math.min(...vals), span = max - min || 1;
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1)) * W},${H - 3 - ((v - min) / span) * (H - 8)}`)
    .join(" ");

  return (
    <svg className="block h-[26px] w-[84px]" viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});
