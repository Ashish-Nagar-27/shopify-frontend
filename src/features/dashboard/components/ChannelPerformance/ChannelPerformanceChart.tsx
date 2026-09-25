import type { FC } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { ChannelPerformanceTooltip } from "./ChannelPerformanceTooltip";
import type { ChartDataItem, ChannelSeries } from "../../hooks/useChannelPerformanceData";

interface ChannelPerformanceChartProps {
    chartData: ChartDataItem[];
    allMax: number;
    chartConfig: ChartConfig;
    series: ChannelSeries[];
    ticks: number[];
    tickFormatter: (value: number, index: number) => string;
}

export const ChannelPerformanceChart: FC<ChannelPerformanceChartProps> = ({
    chartData,
    allMax,
    chartConfig,
    series,
    ticks,
    tickFormatter,
}) => {

 
    return (
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart
                data={chartData}
                margin={{
                    top: 22,
                    right: 20,
                    bottom: 20,
                    left: 10,
                }}
            >
                <defs>
                    <filter id="ov-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {series.map((s) => (
                        <linearGradient key={s.key} id={`ovg-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={s.stroke} stopOpacity="0.26" />
                            <stop offset="100%" stopColor={s.stroke} stopOpacity="0" />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="2 4"
                    opacity={0.5}
                />

                <XAxis
                    dataKey="ts"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    ticks={ticks}
                    tickFormatter={tickFormatter}
                    axisLine={false}
                    tickLine={false}
                    height={18}
                    padding={{ left: 0, right: 0 }}
                    minTickGap={24}
                    tick={{
                        fill: "var(--fg-mute)",
                        fontSize: 11,
                        fontFamily: "JetBrains Mono",
                    }}
                    tickMargin={10}
                />
                <YAxis
                    domain={[0, allMax]}
                    ticks={[0, allMax * 0.2, allMax * 0.4, allMax * 0.6, allMax * 0.8, allMax]}
                    tickFormatter={(v) => `${Math.round(v)}K`}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                    tick={{
                        fill: "var(--fg-mute)",
                        fontSize: 10,
                        fontFamily: "JetBrains Mono",
                    }}
                    tickMargin={8}
                />
                <ChartTooltip
                    content={<ChannelPerformanceTooltip chartData={chartData} series={series} />}
                    cursor={{
                        stroke: "var(--fg-dim)",
                        strokeWidth: 1,
                        strokeDasharray: "2 3",
                        opacity: 0.6,
                    }}
                    position={{ y: 12 }}
                />
                {series.map((s) => (
                    <Area
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        stroke={s.stroke}
                        strokeWidth={2.5}
                        fill={`url(#ovg-${s.key})`}
                        filter="url(#ov-glow)"
                        dot={false}
                        activeDot={{
                            r: 4.5,
                            fill: "var(--bg)",
                            stroke: s.stroke,
                            strokeWidth: 2,
                        }}
                    />
                ))}
            </AreaChart>
        </ChartContainer>
    );
};