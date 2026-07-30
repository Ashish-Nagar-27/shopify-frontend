import type { FC, MouseEvent } from "react";
import type { RecommendationData } from "../types";
import { Icon } from "./Icons";

interface GaugeProps {
    value: number;
    max?: number;
    size?: number;
    thickness?: number;
}

const Gauge: FC<GaugeProps> = ({ value, max = 10, size = 76, thickness = 7 }) => {
    const r = (size - thickness) / 2;
    const cx = size / 2,
        cy = size / 2;
    const C = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, value / max));
    const color = value >= 7 ? "var(--pos)" : value >= 5 ? "var(--warn)" : "var(--neg)";

    return (
        <div className="relative h-[76px] w-[76px] shrink-0">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="var(--surface-2)"
                    strokeWidth={thickness}
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={thickness}
                    strokeDasharray={`${pct * C} ${C}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[20px] font-bold text-fg">
                {value.toFixed(1)}
            </span>
        </div>
    );
};

const RECOS: RecommendationData[] = [
    {
        score: 8.4,
        kind: "scale",
        tag: "SCALE",
        title: "Scale Diabetes — Branded Search",
        parent: "Google · Diabetes Awareness",
        bullets: [
            "Highest ROAS in account at 3.40× — only 12% of total budget.",
            "CPA stable at ₹3.49 across 7 days with rising conversion volume.",
            "Raise daily budget by ₹1,200 → ~+₹4,800/wk projected revenue.",
        ],
    },
    {
        score: 6.3,
        kind: "pause",
        tag: "PAUSE",
        title: "Pause Men Podcast — 50, 60s",
        parent: "Meta · Acidity Gut category",
        bullets: [
            "Spent ₹20,304 for only 21 sales — ROAS stuck at 0.05×.",
            "No improvement across a 5-day window; audience saturated.",
            "Pausing reallocates ~₹3,000/day toward profitable ad sets.",
        ],
    },
];

export const AiInsights: FC = () => {
    return (
        <div className="rounded-[12px] border border-border-soft bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border-soft px-[20px] py-[16px]">
                <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                    AI Insights
                </h3>
                <span className="inline-flex h-[28px] items-center rounded-[10px] border border-border-soft bg-surface px-[12px] font-mono text-[11px] text-fg-dim">
                    2 recommendations
                </span>
            </div>

            <div className="grid grid-cols-1 gap-[20px] p-[20px] xl:grid-cols-[300px_1fr]">
                <div className="flex flex-col gap-[14px]">
                    <span className="inline-flex w-max items-center gap-[6px] rounded-full bg-cyan-soft px-[10px] py-[5px] text-[10px] font-bold uppercase tracking-wider text-cyan">
                        <Icon.sparkle width="11" height="11" /> Pumalyze AI
                    </span>
                    <h2 className="m-0 text-[26px] font-semibold leading-snug tracking-tight text-fg">
                        AI-Powered{" "}
                        <span className="bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
                            Insights
                        </span>
                    </h2>
                    <p className="m-0 text-[13px] leading-relaxed text-fg-dim">
                        Pumalyze continuously scores every campaign, ad set and ad against your attribution model — surfacing the
                        highest-impact moves before performance drifts.
                    </p>
                    <a
                        className="mt-[2px] inline-flex w-max items-center gap-[6px] text-[13px] font-semibold text-cyan transition-all hover:brightness-110"
                        href="#"
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                    >
                        Open Action Center <Icon.chevron width="12" height="12" />
                    </a>
                    <div className="mt-auto flex items-baseline gap-[8px] border-t border-dashed border-border-soft pt-[14px]">
                        <span className="font-mono text-[22px] font-bold text-pos">+₹5,303</span>
                        <span className="text-[12px] text-fg-mute">net projected impact / day</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
                    {RECOS.map((rc, i) => (
                        <div
                            key={i}
                            className="flex flex-col overflow-hidden rounded-[12px] border border-border-soft bg-bg-deep"
                        >
                            <div className="flex items-center gap-[14px] p-[16px_16px_14px]">
                                <Gauge value={rc.score} />
                                <div className="flex min-w-0 flex-col gap-[6px]">
                                    <span
                                        className={`inline-flex w-max items-center gap-[5px] rounded-[6px] px-[9px] py-[4px] text-[10px] font-bold tracking-wider ${rc.kind === "scale"
                                                ? "bg-pos-soft text-pos"
                                                : "bg-neg-soft text-neg"
                                            }`}
                                    >
                                        {rc.tag}
                                    </span>
                                    <span className="text-[14px] font-semibold leading-snug text-fg">
                                        {rc.title}
                                    </span>
                                    <span className="font-mono text-[11px] text-fg-faint">{rc.parent}</span>
                                </div>
                            </div>
                            <ul className="m-0 flex flex-col gap-[9px] border-t border-border-soft list-none p-[14px_16px_16px]">
                                {rc.bullets.map((b, j) => (
                                    <li key={j} className="grid grid-cols-[16px_1fr] gap-[8px] text-[12px] leading-relaxed text-fg-dim">
                                        <span className="grid place-items-center pt-[2px] text-cyan">
                                            <Icon.sparkle width="10" height="10" />
                                        </span>
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
