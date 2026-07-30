import { type FC } from "react";
import { Icon } from "../Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaSpark } from "./AreaChart";
import useChannelPerformanceData from "../../hooks/usePerformanceMatricsData";


export const PerformanceMetrics: FC = () => {
    const { metricsToRender, isLoading } = useChannelPerformanceData();

    return (
        <div className="rounded-[12px] border border-border-soft bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border-soft px-[20px] py-[16px]">
                <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                    Performance Metrics · <span className="text-cyan">All Channels</span>
                </h3>
                <span className="inline-flex h-[28px] items-center gap-[10px] rounded-[10px] border border-border-soft bg-surface px-[12px] font-mono text-[11px] text-fg-dim">
                    Last 7 days
                </span>
            </div>

            <div className="grid grid-cols-1 gap-[14px] p-[18px_20px] sm:grid-cols-2">
                {metricsToRender.map((m) => {
                    let deltaColor = "text-fg-mute bg-surface-2";
                    if (m.tone === "up") deltaColor = "text-pos bg-pos-soft";
                    if (m.tone === "down") deltaColor = "text-neg bg-neg-soft";

                    return (
                        <div
                            key={m.key}
                            className="relative flex min-h-[132px] flex-col gap-[10px] overflow-hidden rounded-[8px] border border-border-soft bg-bg-deep px-4 pt-4 transition-colors duration-150 hover:border-border"
                        >
                            <div className="flex items-start justify-between gap-[10px]">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-mute">
                                    {m.label}
                                </span>
                                {isLoading ? (
                                    <Skeleton className="h-5 w-12 rounded-[6px]" />
                                ) : (
                                    <span className={`inline-flex items-center gap-1 rounded-[6px] px-[7px] py-[3px] font-mono text-[11px] ${deltaColor}`}>
                                        {m.tone === "up" ? (
                                            <Icon.arrowUp width="9" height="9" />
                                        ) : m.tone === "down" ? (
                                            <Icon.arrowDown width="9" height="9" />
                                        ) : null}
                                        {m.delta}
                                    </span>
                                )}
                            </div>
                            <div className="font-sans text-[26px] font-semibold leading-none tracking-tight text-fg [font-variant-numeric:tabular-nums]">
                                {isLoading ? (
                                    <Skeleton className="h-7 w-28 rounded-md my-[3px]" />
                                ) : (
                                    <>
                                        {m.unit && !m.suffix && <span className="mr-[3px] text-[14px] font-medium text-fg-mute">{m.unit}</span>}
                                        {m.val}
                                        {m.unit && m.suffix && <span className="ml-[4px] text-[14px] font-medium text-fg-mute">{m.unit}</span>}
                                    </>
                                )}
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-[44px] -mx-4 w-[calc(100%+32px)] rounded-none mt-auto" />
                            ) : (
                                <AreaSpark data={m.spark} color={m.color} id={`spk-${m.key}`} metricKey={m.key} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

