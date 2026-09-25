import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { fmtO, formatChannelLabel, getChannelColor } from "../components/utils";
import { useMemo } from "react";
import type { ChannelMetricData } from "../types";
import { useGraphSalesMetrics } from "./useDashboardData";

const useChannelMetricsData = () => {
    const { data, isLoading, isError } = useGraphSalesMetrics();
    const channels = useMemo<ChannelMetricData[]>(() => {
        if (!data || typeof data !== "object") return [];

        let colorIdx = 0;

        const list = Object.entries(data)
            .filter(([key, channelData]: [string, any]) => {
                if (key === "adspend" || key === "overalltotal") return false;
                const isAccountPresent =
                    typeof channelData?.accountpresent === "boolean"
                        ? channelData.accountpresent
                        : Boolean(channelData?.accountpresent);
                return isAccountPresent;
            })
            .map(([key, channelData]: [string, any]) => {
                const name = formatChannelLabel(key);
                const color = getChannelColor(key, colorIdx++);

                const spend = channelData.spend?.total ?? 0;
                const conv = channelData.conversion?.total ?? 0;
                const sales = channelData.sales?.total ?? 0;
                const clicks = channelData.click?.total ?? 0;
                const rev = channelData.revenue?.total ?? 0;
                const sessions = channelData.session?.total ?? 0;

                return {
                    name,
                    color,
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

        return list.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            const isGoogleA = nameA === "google";
            const isGoogleB = nameB === "google";
            if (isGoogleA && !isGoogleB) return -1;
            if (!isGoogleA && isGoogleB) return 1;

            const isMetaA = nameA === "meta" || nameA === "facebook";
            const isMetaB = nameB === "meta" || nameB === "facebook";
            if (isMetaA && !isMetaB) return -1;
            if (!isMetaA && isMetaB) return 1;

            return 0;
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
                        {getValue<number>().toFixed(2)}
                    </span>
                ),
            },
            {
                id: "spend",
                header: "Spend",
                accessorKey: "spend",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg-mute [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
                    </span>
                ),
            },
            {
                id: "revenue",
                header: "Revenue",
                accessorKey: "rev",
                cell: ({ getValue }) => (
                    <span className="text-right font-mono text-[13px] text-fg [font-variant-numeric:tabular-nums]">
                        {fmtO(getValue<number>())}
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