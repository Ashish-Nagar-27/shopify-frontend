import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useGetQueryData } from "@/hooks/useGetQueryData";
import { useMemo } from "react";

interface ReportingGraphResponse {
    data: Record<string, { revenue: string; sales: number }[]>;
    revenue: number;
    sales: number;
}

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
    sales: {
        label: "Sales",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ReportingChart({ graphData, graphDataLoading, graphDataError }: { graphData: ReportingGraphResponse | null, graphDataLoading: boolean, graphDataError: Error | null }) {
    // const data = useGetQueryData<ReportingGraphResponse>(["reportingGraphSales"]);

    const chartData = useMemo(() => {
        if (!graphData?.data) return [];

        return Object.entries(graphData.data)
            .map(([date, values]) => ({
                date,
                revenue: Number(values[0]?.revenue ?? 0),
                sales: values[0]?.sales ?? 0,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [graphData]);

    return (
        <Card className="border-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-card-foreground">Revenue & Sales</CardTitle>
                <CardDescription className="text-muted-foreground">
                    {chartData.length > 0
                        ? `${formatDate(chartData[0].date)} – ${formatDate(chartData[chartData.length - 1].date)}`
                        : "No data available"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[350px] w-full"
                >
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <YAxis
                            yAxisId="revenue"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                        />
                        <YAxis
                            yAxisId="sales"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            yAxisId="revenue"
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            fill="url(#fillRevenue)"
                        />
                        <Area
                            yAxisId="sales"
                            type="monotone"
                            dataKey="sales"
                            stroke="var(--color-sales)"
                            strokeWidth={2}
                            fill="url(#fillSales)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
    });
}