import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelPerformanceChart } from "./ChannelPerformanceChart";
import { ChannelPerformanceHeader } from "./ChannelPerformanceHeader";
import { useChannelPerformanceData } from "../../hooks/useChannelPerformanceData";

export const ChannelPerformance: FC = () => {
    const {
        chartData,
        allMax,
        series,
        allChannels,
        selectedKeys,
        toggleChannel,
        maxAllowed,
        chartConfig,
        isLoading,
        isError,
        ticks,
        tickFormatter,
    } = useChannelPerformanceData();

    if (isLoading || isError) {
        return (
            <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">
                <ChannelPerformanceHeader
                    series={series}
                    allChannels={allChannels}
                    selectedKeys={selectedKeys}
                    toggleChannel={toggleChannel}
                    maxAllowed={maxAllowed}
                />
                <div className="flex items-center justify-center p-4">
                    <Skeleton className="h-[240px] w-full" />
                </div>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">
                <ChannelPerformanceHeader
                    series={series}
                    allChannels={allChannels}
                    selectedKeys={selectedKeys}
                    toggleChannel={toggleChannel}
                    maxAllowed={maxAllowed}
                />
                <div className="flex h-[240px] items-center justify-center p-4 text-xs text-fg-mute">
                    No performance data available for the selected period.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">
            {/* Header */}
            <ChannelPerformanceHeader
                series={series}
                allChannels={allChannels}
                selectedKeys={selectedKeys}
                toggleChannel={toggleChannel}
                maxAllowed={maxAllowed}
            />

            {/* Chart */}
            <div className="p-1">
                <ChannelPerformanceChart
                    chartData={chartData}
                    allMax={allMax}
                    chartConfig={chartConfig}
                    series={series}
                    ticks={ticks}
                    tickFormatter={tickFormatter}
                />
            </div>
        </div>
    );
};
