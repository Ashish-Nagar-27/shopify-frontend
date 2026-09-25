import type { AreaSparkProps } from "../../types"; 
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

import { type FC } from "react";
import { fmtO } from "../utils";

export const AreaSpark: FC<AreaSparkProps> = ({ data, color, id, metricKey }) => {
  
    const ys = data.map((d) => d.value);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const yRange = yMax - yMin;

    const domainMin = yRange === 0 ? yMin - 1 : yMin - yRange * 0.05;
    const domainMax = yRange === 0 ? yMax + 1 : yMax + yRange * 0.05;

    const chartConfig = {
        trend: {
            label: "Trend",
            color: color,
        },
    } satisfies ChartConfig;

    const tooltipFormatter = (value: any) => {
    
        const numVal = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(numVal)) return String(value);
        if (metricKey === "roi") {
            return `${numVal.toFixed(2)}%`;
        }
        if (metricKey === "revenue" || metricKey === "spend") {
            return `${fmtO(numVal)}`;
        }

        return fmtO(numVal);
    };

    return (
        <ChartContainer
            config={chartConfig}
            className="-mx-4 aspect-auto bg-transparent"
            style={{ width: "calc(100% + 32px)", height: 44 }}
        >
            <AreaChart
                data={data}
                margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            >
                <defs>
                    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis domain={[domainMin, domainMax]} hide />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value) => [tooltipFormatter(value), ""]}
                            className="relative top-[-34px] border border-border-soft bg-surface shadow-card"
                            labelFormatter={(value) =><>Date: {value}</>}
                        />
                    }
                    cursor={false}
                    
                />
                <Area
                    type="linear"
                    dataKey="value"
                    stroke="var(--color-trend)"
                    strokeWidth={2}
                    fill={`url(#${id})`}
                    dot={false}
                    strokeLinecap="round"
                />
            </AreaChart>
        </ChartContainer>
    );
};
