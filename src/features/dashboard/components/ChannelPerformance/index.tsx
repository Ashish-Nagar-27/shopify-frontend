import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelPerformanceChart } from "./ChannelPerformanceChart"
import { ChannelPerformanceHeader } from "./ChannelPerformanceHeader"
import { useChannelPerformanceData } from "../../hooks/useChannelPerformanceData";


export const ChannelPerformance: FC = () => {
    const { chartData, allMax, chartConfig, isLoading, isError, ticks, tickFormatter } = useChannelPerformanceData();

    if (isLoading || isError || chartData.length === 0) {
        return (
            <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">
                <ChannelPerformanceHeader />
                <div className="flex items-center justify-center p-4">
                    <Skeleton className="h-[240px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">
            {/* Header */}
            <ChannelPerformanceHeader />

            {/* Chart */}
            <div className="p-1">
                <ChannelPerformanceChart
                    chartData={chartData}
                    allMax={allMax}
                    chartConfig={chartConfig}
                    ticks={ticks}
                    tickFormatter={tickFormatter}
                />
            </div>
        </div>
    );
}