import { type FC } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

export interface DonutChartSegment {
    pct: number;
    color: string;
    label?: string;
    count?: number;
}

export interface DonutChartProps {
    data: DonutChartSegment[];
    size?: number;
    thickness?: number;
}

export const DonutChart: FC<DonutChartProps> = ({ data, size = 128, thickness = 16 }) => {
    const chartData = data.map((d, index) => ({
        ...d,
        name: d.label || `segment-${index}`,
        value: d.pct,
        fill: d.color,
    }));

    const outerRadius = size / 2;
    const innerRadius = outerRadius - thickness;

    const chartConfig = {} as ChartConfig;

    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-square"
            style={{ width: size, height: size }}
        >

            <PieChart width={size} height={size}>
                <ChartTooltip
                    cursor={false}
                    wrapperStyle={{ zIndex: 50, minWidth: size, width: 'fit-content' }}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            formatter={(value, name, item) => {
                                const payload = item.payload as Record<string, unknown> | undefined;
                                const count = payload?.count;

                                return (
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <div className="flex items-center gap-1.5 leading-none">
                                            <div
                                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                                style={{
                                                    backgroundColor: item.color || item.payload.fill,
                                                }}
                                            />
                                            <span className="font-semibold text-foreground text-[12px]">{name}</span>
                                        </div>
                                        <div className="pl-3.5 flex items-baseline gap-1 text-[11px] leading-none text-muted-foreground font-mono">
                                            <span className="font-medium text-foreground">{value}%</span>
                                            {typeof count === "number" && (
                                                <span>({count.toLocaleString()})</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    }
                />
                {/* Background track */}
                <Pie
                    data={[{ value: 1 }]}
                    dataKey="value"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill="var(--surface-2)"
                    stroke="none"
                    isAnimationActive={false}
                    style={{ pointerEvents: "none" }}
                />
                {/* Foreground data segments */}
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            style={{
                                filter: `drop-shadow(0 0 4px ${entry.fill})`,
                                outline: "none",
                            }}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    );
};


export interface DonutChartContainerProps {
    chartData: DonutChartSegment[];
    title: string;
    value: string;
    titleClassName?: string;
}

export const DonutChartContainer: FC<DonutChartContainerProps> = ({
    chartData,
    title,
    value,
    titleClassName = "text-[18px] [font-variant-numeric:tabular-nums]",
}) => {
    return (
        <div className="relative h-[128px] w-[128px] shrink-0">
            <DonutChart data={chartData} size={128} thickness={16} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className={`font-semibold leading-none tracking-tight text-fg ${titleClassName}`}>
                    {title}
                </span>
                <span className="mt-[5px] text-[9px] font-semibold uppercase tracking-widest text-fg-mute">
                    {value}
                </span>
            </div>
        </div>
    );
};


export const DonutChartLoader: FC = () => {
    return <div className="flex w-full items-center justify-center py-4">
        <Skeleton className="h-[128px] w-[128px] rounded-full shrink-0" />
    </div>
}