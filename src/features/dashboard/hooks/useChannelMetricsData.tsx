import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { fmtO } from "../components/utils";
import { useMemo } from "react";
import type { ChannelMetricData } from "../types";
import { useGraphSalesMetrics } from "./useDashboardData";

const CHANNEL_METADATA: Record<string, { name: string; color: string }> = {
    google: { name: "Google", color: "var(--cyan)" },
    meta: { name: "Meta", color: "var(--violet)" },
    tiktok: { name: "TikTok", color: "var(--blue-accent)" },
    twitter: { name: "X (Twitter)", color: "var(--magenta)" },
};


const useChannelMetricsData = () => {
    const { data, isLoading, isError } = useGraphSalesMetrics();
    const channels = useMemo<ChannelMetricData[]>(() => {
        if (!data) return [];
        return Object.entries(data)
            .filter(([key, channelData]: [string, any]) => key !== "adspend" && typeof channelData?.accountpresent === 'boolean' && channelData?.accountpresent)
            .map(([key, channelData]: [string, any]) => {
                const metadata = CHANNEL_METADATA[key] || {
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    color: "var(--fg-mute)",
                };


                const spend = channelData.spend?.total ?? 0;
                const conv = channelData.conversion?.total ?? 0;
                const sales = channelData.sales?.total ?? 0;
                const clicks = channelData.click?.total ?? 0;
                const rev = channelData.revenue?.total ?? 0;
                const sessions = channelData.session?.total ?? 0;

                return {
                    name: metadata.name,
                    color: metadata.color,
                    sessions,
                    clicks,
                    conv,
                    sales,
                    cpa: channelData.cpa?.total ?? (conv > 0 ? spend / conv : 0),
                    spend,
                    rev,
                    roas: channelData.roas?.total ?? (spend > 0 ? rev / spend : 0),
                    roi: channelData.roi?.total ?? 0,
                };
            });
    }, [data]);

    const tot = useMemo(() => {
        return channels.reduce(
            (a, c) => ({
                rev: a.rev + c.rev,
                spend: a.spend + c.spend,
                sessions: a.sessions + c.sessions,
                conv: a.conv + c.conv,
                clicks: a.clicks + c.clicks,
                sales: a.sales + c.sales,
                roi: a.roi + c.roi,
            }),
            { rev: 0, spend: 0, sessions: 0, conv: 0, clicks: 0, sales: 0, roi: 0 }
        );
    }, [channels]);


    //  table columns
    const columns = useMemo<ColumnDef<ChannelMetricData>[]>(
        () => [
            {
                id: "channel",
                header: "Channel",
                accessorKey: "name",
                cell: ({ row }) => {
                    const c = row.original;
                    return (
                        <span className="inline-flex min-w-0 items-center gap-[10px]">
                            <span
                                className="inline-flex items-center gap-[7px] rounded-[7px] border border-solid px-[11px] pl-[9px] py-[5px] text-[12px] font-semibold text-fg"
                                style={{ borderColor: c.color }}
                            >
                                <span
                                    className="h-[8px] w-[8px] rounded-full"
                                    style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                                />
                                {c.name}
                            </span>
                        </span>
                    );
                },
            },
            {
                id: "sessions",
                header: "Sessions",
                accessorKey: "sessions",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "clicks",
                header: "Clicks",
                accessorKey: "clicks",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "conversions",
                header: "Conversions",
                accessorKey: "conv",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "sales",
                header: "Sales",
                accessorKey: "sales",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "cpa",
                header: "CPA",
                accessorKey: "cpa",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg-mute [font-variant-numeric:tabular-nums]">
                        ₹{getValue<number>().toFixed(2)}
                    </span>
                ),
            },
            {
                id: "spend",
                header: "Spend",
                accessorKey: "spend",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg-mute [font-variant-numeric:tabular-nums]">
                        ₹{fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "revenue",
                header: "Revenue",
                accessorKey: "rev",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        ₹{fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "roas",
                header: "ROAS",
                accessorKey: "roas",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[12px] font-bold text-pos">
                        {getValue<number>().toFixed(2)}×
                    </span>
                ),
            },
            {
                id: "roi",
                header: "ROI",
                accessorKey: "roi",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[12px] font-bold text-pos">
                        {getValue<number>().toFixed(2)}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: channels,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return {
        table,
        tot,
        columns,
        channels,
        isLoading,
        isError
    }
}


export default useChannelMetricsData