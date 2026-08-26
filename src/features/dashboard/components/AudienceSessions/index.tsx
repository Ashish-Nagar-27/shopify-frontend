import { type FC } from "react";
import { Icon } from "../Icons";
import { fmtO } from "../utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChartLoader, DonutChartContainer, type DonutChartSegment } from "./DonutChart";
import { AppTooltip } from "@/components/shared/AppTooltip";
import useAudienceSessions from "../../hooks/useAudienceSessions";
import { useInView } from "@/hooks/useInView";



export const AudienceSessions: FC = () => {
    const [containerRef, isInView] = useInView<HTMLDivElement>({ triggerOnce: true });

    const { billableValue,
        tone,
        growthText,
        deltaColor,
        trafficData,
        lead,
        visitorsTotal,
        segs,
        isLoading, TOOLTIPS
    } = useAudienceSessions({ enabled: isInView });


    return (
        <div ref={containerRef} className="rounded-[12px] border border-border-soft bg-surface shadow-card">

            {/* header */}
            <div className="flex items-center justify-between border-b border-border-soft px-[20px] py-[16px]">
                <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                    Traffic &amp; Sessions
                </h3>
                <span className="inline-flex h-[28px] items-center rounded-[10px] border border-border-soft bg-surface px-[12px] font-mono text-[11px] text-fg-dim">
                    Sources · New vs Returning
                </span>
            </div>

            <div className="flex flex-col items-stretch p-0 lg:flex-row">

            {/* Billable Session */}
                <div
                    className="flex w-full shrink-0 flex-col justify-center gap-[8px] border-b border-border-soft bg-gradient-to-br from-cyan-soft to-transparent p-[18px_20px] lg:w-[208px] lg:border-b-0 lg:border-r"
                    title="Billing metric — used to calculate client invoicing"
                >
                    <span className="inline-flex items-center gap-[6px] text-[10px] font-bold uppercase tracking-wider text-cyan">
                        <Icon.sparkle width="11" height="11" /> Billable Sessions
                    </span>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-7 w-28 rounded-md my-[3px]" />
                            <Skeleton className="h-5 w-20 rounded-[6px]" />
                        </>
                    ) : (
                        <>
                            <span className="font-sans text-[27px] font-semibold leading-tight tracking-tight text-fg [font-variant-numeric:tabular-nums]">
                                {fmtO(billableValue)}
                            </span>
                            <span
                                className={`inline-flex w-max items-center gap-[4px] rounded-[6px] px-[7px] py-[3px] font-mono text-[11px] ${deltaColor}`}
                            >
                                {tone === "up" && <Icon.arrowUp width="9" height="9" />}
                                {tone === "down" && <Icon.arrowDown width="9" height="9" />}
                                {growthText} vs last period
                            </span>
                        </>
                    )}
                    <span className="mt-[1px] text-[10.5px] leading-relaxed text-fg-faint">
                        Tracked for usage-based billing
                    </span>
                </div>

                {/* Donut Chart 1 */}
                <div className="flex flex-1 items-center gap-[20px] p-[16px_22px] max-md:flex-col max-md:text-center">
                    {isLoading ? (
                        <DonutChartLoader />
                    ) : (
                        <>
                            <DonutChartContainer
                                chartData={trafficData}
                                title={`${lead.pct}%`}
                                value={lead.label}
                                titleClassName="text-[22px]"
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                                {trafficData.map((t: DonutChartSegment, index: number) => {
                                    const tooltipText = t.label ? TOOLTIPS[t.label] : undefined;

                                    return (
                                        <div
                                            key={t.label || index}
                                            className="grid grid-cols-[10px_1fr_auto] items-center gap-[10px]"
                                        >
                                            <span
                                                className="h-[9px] w-[9px] rounded-[3px]"
                                                style={{
                                                    background: t.color,
                                                    boxShadow: `0 0 8px ${t.color}`,
                                                }}
                                            />
                                            <div className="flex items-center gap-1.5 justify-self-start">
                                                <span className="text-[12.5px] text-fg-dim">
                                                    {t.label}
                                                </span>
                                                {tooltipText && (
                                                    <AppTooltip content={tooltipText}>
                                                        <span className="text-fg-mute hover:text-fg cursor-help leading-none flex items-center shrink-0">
                                                            <Icon.info width="11" height="11" />
                                                        </span>
                                                    </AppTooltip>
                                                )}
                                            </div>
                                            <span className="font-mono text-[12.5px] font-bold text-fg">
                                                {t.pct}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Donut Chart 2 */}
                <div className="flex flex-1 items-center gap-[20px] border-t border-border-soft p-[16px_22px] lg:border-l lg:border-t-0 max-md:flex-col max-md:text-center">
                    {isLoading ? (
                        <DonutChartLoader />
                    ) : (
                        <>
                            <DonutChartContainer
                                chartData={segs}
                                title={fmtO(visitorsTotal)}
                                value="Total Visitors"
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                                {segs.map((s: DonutChartSegment, index: number) => (
                                    <div
                                        key={s.label || index}
                                        className="flex flex-col gap-[3px] rounded-[8px] border border-border-soft bg-bg-deep p-[8px_10px]"
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <span
                                                className="h-[8px] w-[8px] shrink-0 rounded-full"
                                                style={{
                                                    background: s.color,
                                                    boxShadow: `0 0 8px ${s.color}`,
                                                }}
                                            />
                                            <span className="flex-1 text-[12px] text-fg-dim">
                                                {s.label}
                                            </span>
                                            <span className="font-mono text-[13px] font-bold text-fg">
                                                {s.pct}%
                                            </span>
                                        </div>
                                        <span className="pl-[16px] font-mono text-[10.5px] text-fg-mute">
                                            {fmtO(s.count)} visitors
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};



