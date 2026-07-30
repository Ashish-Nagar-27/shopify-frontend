import type { FC } from "react";
import { PERF_SERIES } from "./constants";
import type { CustomTooltipProps } from "../../types";
import { format } from "date-fns";

export const ChannelPerformanceTooltip: FC<CustomTooltipProps> = ({ active, payload, label, chartData }) => {
    if (!active || !payload || !payload.length || !chartData) return null;

    const activeItem = payload[0].payload;
    const index = chartData.findIndex((d) => d.date === activeItem.date);
    const isRightSide = index > chartData.length / 1.6;
    
    return (
        <div
            className="pointer-events-none min-w-[150px] rounded-[8px] border border-border bg-bg-deep/96 p-[10px_12px] text-[12px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]"
            style={{
                transform: isRightSide ? "translateX(calc(-100% - 18px))" : "translateX(18px)",
            }}
        >
            <div className="mb-[6px] font-mono text-[11px] text-fg-mute">{label && format(new Date(label), "MMM d, yyyy")} {activeItem.year}</div>
            {payload.map((item) => {
                const s = PERF_SERIES.find((series) => series.key === item.dataKey);
                if (!s) return null;
                return (
                    <div key={s.key} className="flex items-center gap-[8px] py-[2px]">
                        <span className="h-[8px] w-[8px] rounded-full" style={{ background: s.stroke }} />
                        <span className="flex-1 text-[11px] text-fg-mute">{s.label}</span>
                        <span className="font-mono text-[12px] font-semibold text-fg">
                            ₹{Math.round(item.value)}K
                        </span>
                    </div>
                );
            })}
        </div>
    );
};