import { Fragment, type FC } from "react";
import { fmtO } from "../utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
    flexRender,
} from "@tanstack/react-table";
import useChannelMetricsData from "../../hooks/useChannelMetricsData";


export const ChannelMetrics: FC = () => {

    const { table, channels, tot, isLoading, isError } = useChannelMetricsData();
    
    return (
        <div className="flex flex-col rounded-[12px] border border-border-soft bg-surface shadow-card">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-soft px-[20px] py-[16px]">
                <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                    Channel Metrics
                </h3>
                <span className="inline-flex h-[28px] items-center rounded-[10px] border border-border-soft bg-surface px-[12px] font-mono text-[11px] text-fg-dim">
                    by Revenue
                </span>
            </div>


            {/* table */}
            <div className="flex overflow-x-auto flex-col">
                <div className="grid min-w-[1000px] grid-cols-[1.3fr_0.9fr_0.9fr_1fr_0.9fr_1fr_1.1fr_1.1fr_0.8fr_0.8fr] items-center gap-[10px] border-b border-border-soft px-[20px] py-[11px] text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-mute [&>span:not(:first-child)]:text-right [&>span:not(:first-child)]:[font-variant-numeric:tabular-nums]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        headerGroup.headers.map((header) => (
                            <span key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </span>
                        ))
                    ))}
                </div>

                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="grid min-w-[1000px] grid-cols-[1.3fr_0.9fr_0.9fr_1fr_0.9fr_1fr_1.1fr_1.1fr_0.8fr_0.8fr] items-center gap-[10px] border-b border-border-soft px-[20px] py-[11px]"
                        >
                            <span className="inline-flex min-w-0 items-center gap-[10px]">
                                <Skeleton className="h-[28px] w-[80px] rounded-[7px]" />
                            </span>
                            {Array.from({ length: 9 }).map((_, sIdx) => (
                                <span key={sIdx} className="flex justify-end">
                                    <Skeleton className="h-5 w-12 rounded" />
                                </span>
                            ))}
                        </div>
                    ))
                ) : isError ? (
                    <div className="flex items-center justify-center py-8 text-fg-mute text-[13px]">
                        Failed to load channel metrics data.
                    </div>
                ) : channels.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-fg-mute text-[13px]">
                        No active channels connected.
                    </div>
                ) : (
                    table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className="grid min-w-[1000px] grid-cols-[1.3fr_0.9fr_0.9fr_1fr_0.9fr_1fr_1.1fr_1.1fr_0.8fr_0.8fr] items-center gap-[10px] border-b border-border-soft px-[20px] py-[11px] transition-colors duration-120 last:border-b-0 hover:bg-bg-row-hover"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <Fragment key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Fragment>
                            ))}
                        </div>
                    ))
                )}

                {channels.length > 0 && (
                    <div className="grid min-w-[1000px] grid-cols-[1.3fr_0.9fr_0.9fr_1fr_0.9fr_1fr_1.1fr_1.1fr_0.8fr_0.8fr] gap-[10px] border-t border-border bg-bg-footer px-[20px] py-[13px] font-mono text-[13px] font-bold text-fg [font-variant-numeric:tabular-nums] [&>span:first-child]:font-sans [&>span:first-child]:text-[11px] [&>span:first-child]:font-semibold [&>span:first-child]:uppercase [&>span:first-child]:tracking-[0.12em] [&>span:first-child]:text-fg-mute [&>span:not(:first-child)]:text-right">
                        <span>Total</span>
                        <span>{fmtO(tot.sessions)}</span>
                        <span>{fmtO(tot.clicks)}</span>
                        <span>{fmtO(tot.conv)}</span>
                        <span>{fmtO(tot.sales)}</span>
                        <span>{tot.conv > 0 ? (tot.spend / tot.conv).toFixed(2) : "0.00"}</span>
                        <span>{fmtO(tot.spend)}</span>
                        <span>{fmtO(tot.rev)}</span>
                        <span>{tot.spend > 0 ? (tot.rev / tot.spend).toFixed(2) : "0.00"}×</span>
                        <span>{tot.spend > 0 ? (tot.rev / tot.spend).toFixed(2) : "0.00"}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
