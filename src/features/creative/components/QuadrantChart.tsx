import { useState } from "react";
import { CREATIVES, STATUS_META } from "../data/creatives";
import { fmtC } from "../utils/format";
import type { CreativeStatus } from "../types/creative";

const STATUS_COLOR: Record<CreativeStatus, string> = {
  winner: "var(--pos)",
  fatigue: "var(--warn)",
  testing: "var(--cyan)",
  kill: "var(--neg)",
};

export function QuadrantChart() {
  const W = 920, H = 340, PL = 52, PR = 24, PT = 26, PB = 40;
  const iw = W - PL - PR, ih = H - PT - PB;
  const [hover, setHover] = useState<string | null>(null);

  const maxSpend = 25000, maxRoas = 4.2, roasTarget = 2.0, spendSplit = 3000;
  const x = (s: number) => PL + (Math.sqrt(s) / Math.sqrt(maxSpend)) * iw;
  const y = (r: number) => PT + ih - (Math.min(r, maxRoas) / maxRoas) * ih;
  const r = (rev: number) => 7 + (Math.sqrt(rev) / Math.sqrt(70000)) * 22;

  const quads = [
    { t: "HIDDEN GEMS — feed budget", xx: PL + 10, yy: PT + 16, a: "start" as const },
    { t: "SCALE — proven at spend", xx: PL + iw - 10, yy: PT + 16, a: "end" as const },
    { t: "WATCH — keep testing", xx: PL + 10, yy: PT + ih - 10, a: "start" as const },
    { t: "MONEY PIT — cut fast", xx: PL + iw - 10, yy: PT + ih - 10, a: "end" as const },
  ];

  const hoverC = hover ? CREATIVES.find((k) => k.id === hover) : null;
  const px = hoverC ? (x(hoverC.spend) / W) * 100 : 0;

  return (
    <div className="rounded-xl border border-border-soft bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
        <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
          Spend × ROAS · <span className="text-cyan">bubble = revenue</span>
        </h3>
        <div className="flex flex-wrap gap-[18px]">
          {Object.entries(STATUS_META).map(([k, m]) => (
            <span key={k} className="inline-flex items-center gap-2 text-xs text-fg-dim">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: STATUS_COLOR[k as CreativeStatus], boxShadow: `0 0 10px ${STATUS_COLOR[k as CreativeStatus]}` }}
              />
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative px-4 pb-3.5 pt-2.5">
        <svg className="block h-[340px] w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <line x1={PL} x2={PL + iw} y1={y(roasTarget)} y2={y(roasTarget)} stroke="oklch(0.40 0.03 235)" strokeWidth="1" strokeDasharray="5 5" />
          <line x1={x(spendSplit)} x2={x(spendSplit)} y1={PT} y2={PT + ih} stroke="oklch(0.40 0.03 235)" strokeWidth="1" strokeDasharray="5 5" />
          <text x={PL + iw - 6} y={y(roasTarget) - 6} fontSize="9.5" textAnchor="end" fill="var(--fg-mute)" fontFamily="JetBrains Mono">
            target ROAS 2.0×
          </text>

          {quads.map((q, i) => (
            <text key={i} x={q.xx} y={q.yy} fontSize="9.5" fontWeight="700" letterSpacing="1.2" textAnchor={q.a} fill="var(--fg-faint)" fontFamily="Space Grotesk">
              {q.t}
            </text>
          ))}

          <text x={PL + iw / 2} y={H - 8} fontSize="10" textAnchor="middle" fill="var(--fg-mute)" fontFamily="JetBrains Mono">
            SPEND →
          </text>
          <text
            x={14}
            y={PT + ih / 2}
            fontSize="10"
            textAnchor="middle"
            fill="var(--fg-mute)"
            fontFamily="JetBrains Mono"
            transform={`rotate(-90 14 ${PT + ih / 2})`}
          >
            ROAS →
          </text>

          {CREATIVES.map((c) => (
            <circle
              key={c.id}
              cx={x(c.spend)}
              cy={y(c.roas)}
              r={r(c.rev)}
              fill={STATUS_COLOR[c.status]}
              fillOpacity={hover === c.id ? 0.5 : 0.28}
              stroke={STATUS_COLOR[c.status]}
              strokeWidth="1.5"
              style={{ cursor: "pointer", transition: "fill-opacity .12s" }}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>

        {hoverC && (
          <div
            className="pointer-events-none absolute z-[3] min-w-[170px] rounded-lg border border-border bg-[oklch(0.10_0.018_240/0.96)] px-3 py-2.5 text-xs shadow-[0_8px_24px_-8px_oklch(0_0_0/0.6)]"
            style={{
              left: `${px}%`,
              top: `${(y(hoverC.roas) / H) * 100}%`,
              transform: px > 60 ? "translate(calc(-100% - 16px), -50%)" : "translate(16px, -50%)",
            }}
          >
            <div className="mb-1.5 text-xs font-semibold text-fg">{hoverC.name}</div>
            <div className="flex items-center justify-between gap-3.5 py-[1.5px]">
              <span className="text-[11px] text-fg-mute">Spend</span>
              <span className="font-mono text-[11.5px] text-fg">{fmtC(hoverC.spend)}</span>
            </div>
            <div className="flex items-center justify-between gap-3.5 py-[1.5px]">
              <span className="text-[11px] text-fg-mute">Revenue</span>
              <span className="font-mono text-[11.5px] text-fg">{fmtC(hoverC.rev)}</span>
            </div>
            <div className="flex items-center justify-between gap-3.5 py-[1.5px]">
              <span className="text-[11px] text-fg-mute">ROAS</span>
              <span className="font-mono text-[11.5px] text-fg">{hoverC.roas.toFixed(2)}×</span>
            </div>
            <div className="flex items-center justify-between gap-3.5 py-[1.5px]">
              <span className="text-[11px] text-fg-mute">Frequency</span>
              <span className="font-mono text-[11.5px] text-fg">{hoverC.freq.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
