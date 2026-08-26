import type { FC } from "react";
import type { CustomTooltipProps } from "../../types";
import type { ChannelSeries } from "../../hooks/useChannelPerformanceData";
import { format } from "date-fns";

interface ChannelPerformanceTooltipProps extends CustomTooltipProps {
    series?: ChannelSeries[];
}

export const ChannelPerformanceTooltip: FC<ChannelPerformanceTooltipProps> = ({
    active,
    payload,
    label,
    chartData,
    series = [],
}) => {
    if (!active || !payload || !payload.length || !chartData) return null;

    const activeItem = payload[0].payload;
    const index = chartData.findIndex((d) => d.date === activeItem.date);
    const isRightSide = index > chartData.length / 1.6;

    const dateVal = activeItem?.ts ? new Date(activeItem.ts) : label ? new Date(label) : null;
    const formattedDate = dateVal && !isNaN(dateVal.getTime()) ? format(dateVal, "MMM d, yyyy") : activeItem?.date || "";

    return (
        <div
            className="pointer-events-none min-w-[150px] rounded-[8px] border border-border bg-bg-deep/96 p-[10px_12px] text-[12px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]"
            style={{
                transform: isRightSide ? "translateX(calc(-100% - 18px))" : "translateX(18px)",
            }}
        >
            <div className="mb-[6px] font-mono text-[11px] text-fg-mute">
                {formattedDate} {activeItem.year ?? ""}
            </div>
            {payload.map((item) => {
                const s = series.find((ser) => ser.key === item.dataKey);
                const color = s?.stroke || item.color || item.stroke || "var(--fg-mute)";
                const labelText = s?.label || item.name || item.dataKey;
                const numVal = typeof item.value === "number" ? item.value : 0;

                return (
                    <div key={item.dataKey} className="flex items-center gap-[8px] py-[2px]">
                        <span className="h-[8px] w-[8px] rounded-full" style={{ background: color }} />
                        <span className="flex-1 text-[11px] text-fg-mute">{labelText}</span>
                        <span className="font-mono text-[12px] font-semibold text-fg">
                            ₹{Math.round(numVal)}K
                        </span>
                    </div>
                );
            })}
        </div>
    );
};