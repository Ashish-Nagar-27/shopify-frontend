import { useMemo, useState } from "react";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { STATUS_META } from "../data/creatives";
import { fmtC } from "../utils/format";
import { CrThumb } from "../components/CrThumb";
import { TrendSpark } from "../components/TrendSpark";
import { useFacebookCreativeData } from "./useCreativeData";
import type { Creative, CreativeFormat, CreativeStatus } from "../types/creative";

/**
 * Stable empty array reference to prevent unnecessary component re-renders
 * when the API response or creative list is undefined/null.
 */
const EMPTY_CREATIVES: any[] = [];

/**
 * Helper function to normalize raw API creative data into a consistent Creative object structure.
 * 
 * - Maps format strings ("video", "share", "carousel", "static") to standard CreativeFormat types.
 * - Converts decimal rate fields (e.g. 0.032 to 3.2%) safely.
 * - Computes deterministic fallback IDs for smooth React DOM node keying.
 */
function normalizeCreative(c: any, index: number): Creative {
    if (!c || typeof c !== "object") {
        return {
            id: `fallback_${index}`,
            name: "Untitled Creative",
            fmt: "Video",
            hue: 200,
            spend: 0,
            rev: 0,
            roas: 0,
            cpa: 0,
            hook: 0,
            hold: 0,
            ctr: 0,
            freq: 1.0,
            trend: [0, 0, 0, 0, 0, 0, 0],
            status: "testing",
        };
    }

    // Format normalization (API "share" maps to "Static" on frontend)
    const formatStr = typeof c.format === "string" ? c.format.toLowerCase() : (typeof c.fmt === "string" ? c.fmt.toLowerCase() : "video");
    let fmt: CreativeFormat = "Video";
    if (formatStr === "video") {
        fmt = "Video";
    } else if (formatStr === "carousel") {
        fmt = "Carousel";
    } else if (formatStr === "static" || formatStr === "share" || formatStr === "image" || formatStr === "photo") {
        fmt = "Static";
    } else {
        const formattedFmt = formatStr.charAt(0).toUpperCase() + formatStr.slice(1).toLowerCase();
        const validFormats: CreativeFormat[] = ["Video", "Carousel", "Static"];
        fmt = validFormats.includes(formattedFmt as CreativeFormat)
            ? (formattedFmt as CreativeFormat)
            : "Static";
    }

    // Hook rate conversion (convert decimal 0.25 to 25.0%)
    const rawHook = Number(c.hook);
    const validHook = isNaN(rawHook) ? 0 : rawHook;
    const hook = validHook <= 1 ? parseFloat((validHook * 100).toFixed(1)) : parseFloat(validHook.toFixed(1));

    // Hold rate conversion
    const rawHold = Number(c.hold);
    const validHold = isNaN(rawHold) ? 0 : rawHold;
    const hold = validHold <= 1 ? parseFloat((validHold * 100).toFixed(1)) : parseFloat(validHold.toFixed(1));

    // CTR conversion
    const rawCtr = Number(c.ctr);
    const validCtr = isNaN(rawCtr) ? 0 : rawCtr;
    const ctr = validCtr <= 1 ? parseFloat((validCtr * 100).toFixed(2)) : parseFloat(validCtr.toFixed(2));

    // 7-day CTR trend sparkline mapping
    const rawTrend = c.ctr_trend_7d || c.trend;
    let trend: number[] = [];
    if (Array.isArray(rawTrend) && rawTrend.length > 0) {
        trend = rawTrend.map((t: any) => {
            const v = typeof t === "number" ? t : Number(t?.ctr);
            const validV = isNaN(v) ? 0 : v;
            return validV <= 1 ? parseFloat((validV * 100).toFixed(2)) : parseFloat(validV.toFixed(2));
        });
    }
    if (trend.length === 0) {
        trend = [0, 0, 0, 0, 0, 0, 0];
    }

    // Status label mapping
    const rawStatus = String(c.status || "testing").toLowerCase();
    const validStatuses: CreativeStatus[] = ["winner", "fatigue", "testing", "kill"];
    const status: CreativeStatus = validStatuses.includes(rawStatus as CreativeStatus)
        ? (rawStatus as CreativeStatus)
        : "testing";

    // Numeric metric fallbacks
    const spend = isNaN(Number(c.spend)) ? 0 : Number(c.spend);
    const rev = isNaN(Number(c.revenue ?? c.rev)) ? 0 : Number(c.revenue ?? c.rev);
    const rawRoas = Number(c.roas);
    const roas = !isNaN(rawRoas) ? rawRoas : (spend > 0 ? rev / spend : 0);
    const cpa = isNaN(Number(c.cpa)) ? 0 : Number(c.cpa);
    const rawFreq = Number(c.frequency ?? c.freq);
    const freq = isNaN(rawFreq) || rawFreq <= 0 ? 1.0 : rawFreq;

    // Unique deterministic key
    const id = String(c.creative_id || c.id || `${c.creative_name || c.name || "cr"}_${index}_${spend}`);

    return {
        id,
        name: String(c.creative_name || c.name || "Untitled Creative"),
        fmt,
        hue: isNaN(Number(c.hue)) ? 200 : Number(c.hue),
        spend,
        rev,
        roas,
        cpa,
        hook,
        hold,
        ctr,
        freq,
        trend,
        status,
    };
}

/**
 * Custom Hook: `useCreativeTableData`
 * 
 * Encapsulates all data fetching, normalization, filtering, sorting, totals calculation,
 * and TanStack React Table instance configuration for `CreativeTable2`.
 */
export function useCreativeTableData() {
    // -------------------------------------------------------------------------
    // 1. Fetch Creative Insights Data from API
    // -------------------------------------------------------------------------
    const { data, isLoading } = useFacebookCreativeData();
    const rawCreatives = data?.creatives ?? EMPTY_CREATIVES;
    const apiTotals = data?.totals;

    // -------------------------------------------------------------------------
    // 2. Normalize raw API objects into consistent Creative types
    // -------------------------------------------------------------------------
    const creativeData = useMemo<Creative[]>(() => {
        if (!Array.isArray(rawCreatives) || rawCreatives.length === 0) return EMPTY_CREATIVES;
        return rawCreatives.map((item, idx) => normalizeCreative(item, idx));
    }, [rawCreatives]);

 
    // -------------------------------------------------------------------------
    // 3. Component Filter & Sorting States
    // -------------------------------------------------------------------------
    const [fmt, setFmt] = useState<string>("All");
    const [st, setSt] = useState<string>("All");
    const [sorting, setSorting] = useState<SortingState>([
        { id: "spend", desc: true },
    ]);

    // -------------------------------------------------------------------------
    // 4. Filter Rows based on Format and Status pills
    // -------------------------------------------------------------------------
    const filteredRows = useMemo<Creative[]>(() => {
        if (!Array.isArray(creativeData)) return [];
        return creativeData.filter(
            (c) =>
                c &&
                (fmt === "All" ||
                    c.fmt === fmt ||
                    (fmt === "Static" && (c.fmt === "Static" || String((c as any).fmt).toLowerCase() === "share"))) &&
                (st === "All" || (STATUS_META[c.status]?.label || "Testing") === st)
        );
    }, [creativeData, fmt, st]);

    // -------------------------------------------------------------------------
    // 5. Calculate Summary Totals & Display Metrics
    // -------------------------------------------------------------------------
    const tot = useMemo(
        () =>
            filteredRows.reduce(
                (a, c) => ({
                    spend: a.spend + (Number(c?.spend) || 0),
                    rev: a.rev + (Number(c?.rev) || 0),
                }),
                { spend: 0, rev: 0 }
            ),
        [filteredRows]
    );

    // Use API-provided totals when unfiltered; fall back to filtered calculations
    const isFiltered = fmt !== "All" || st !== "All";
    const displaySpend = (!isFiltered && apiTotals?.spend != null) ? Number(apiTotals.spend) : tot.spend;
    const displayBlendedRoas = (!isFiltered && apiTotals?.blended_roas != null)
        ? Number(apiTotals.blended_roas)
        : (tot.spend > 0 ? tot.rev / tot.spend : 0);

    // -------------------------------------------------------------------------
    // 6. Define Table Column Configurations
    // -------------------------------------------------------------------------
    const columns = useMemo<ColumnDef<Creative>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                header: "Creative",
                cell: ({ row }) => {
                    const c = row.original;
                    const name = c?.name || "Untitled Creative";
                    const fmtText = (c?.fmt || "Video").toUpperCase();
                    const holdVal = typeof c?.hold === "number" && !isNaN(c.hold) ? c.hold : 0;
                    return (
                        <div className="flex min-w-0 items-center gap-3">
                            <CrThumb c={c} />
                            <div className="flex min-w-0 flex-col gap-[3px]">
                                <span
                                    title={name}
                                    className="max-w-[280px] truncate text-[12.5px] font-semibold text-fg"
                                >
                                    {name}
                                </span>
                                <span className="flex items-center gap-2 font-mono text-[10.5px] text-fg-faint">
                                    <span className="inline-flex rounded-[5px] bg-surface-2 px-[7px] py-[2px] text-[9px] font-bold tracking-[0.09em] text-fg-dim">
                                        {fmtText}
                                    </span>
                                    hold {holdVal}%
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "status",
                accessorFn: (row) => (row?.status && STATUS_META[row.status]?.label) || "Testing",
                header: "Status",
                cell: ({ row }) => {
                    const c = row.original;
                    const statusKey = (c?.status && STATUS_META[c.status]) ? c.status : "testing";
                    const meta = STATUS_META[statusKey] || STATUS_META.testing;
                    return (
                        <span
                            className={cn(
                                "inline-flex w-max items-center gap-[5px] rounded-full px-[9px] py-1 text-[10px] font-bold tracking-[0.07em]",
                                statusKey === "winner"
                                    ? "bg-pos-soft text-pos"
                                    : statusKey === "fatigue"
                                        ? "bg-warn-soft text-warn"
                                        : statusKey === "testing"
                                            ? "bg-cyan-soft text-cyan"
                                            : "bg-neg-soft text-neg"
                            )}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                    background:
                                        statusKey === "winner"
                                            ? "var(--pos)"
                                            : statusKey === "fatigue"
                                                ? "var(--warn)"
                                                : statusKey === "testing"
                                                    ? "var(--cyan)"
                                                    : "var(--neg)",
                                    boxShadow: `0 0 6px ${statusKey === "winner"
                                            ? "var(--pos)"
                                            : statusKey === "fatigue"
                                                ? "var(--warn)"
                                                : statusKey === "testing"
                                                    ? "var(--cyan)"
                                                    : "var(--neg)"
                                        }`,
                                }}
                            />
                            {meta.label}
                        </span>
                    );
                },
            },
            {
                id: "spend",
                accessorKey: "spend",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            Spend
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const spend = Number(row.original?.spend);
                    return (
                        <span className="font-mono text-[12.5px] text-fg tabular-nums">
                            {fmtC(isNaN(spend) ? 0 : spend)}
                        </span>
                    );
                },
            },
            {
                id: "rev",
                accessorKey: "rev",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            Revenue
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const rev = Number(row.original?.rev);
                    return (
                        <span className="font-mono text-[12.5px] text-fg-mute tabular-nums">
                            {fmtC(isNaN(rev) ? 0 : rev)}
                        </span>
                    );
                },
            },
            {
                id: "roas",
                accessorKey: "roas",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            ROAS
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const roas = Number(row.original?.roas);
                    const validRoas = isNaN(roas) ? 0 : roas;
                    return (
                        <span
                            className={cn(
                                "font-mono text-[12.5px] tabular-nums",
                                validRoas >= 2 ? "font-bold text-pos" : validRoas < 1 ? "font-bold text-neg" : "text-fg"
                            )}
                        >
                            {validRoas.toFixed(2)}×
                        </span>
                    );
                },
            },
            {
                id: "cpa",
                accessorKey: "cpa",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            CPA
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const cpa = Number(row.original?.cpa);
                    return (
                        <span className="font-mono text-[12.5px] text-fg-mute tabular-nums">
                            {fmtC(isNaN(cpa) ? 0 : cpa)}
                        </span>
                    );
                },
            },
            {
                id: "hook",
                accessorKey: "hook",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            Hook
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const hook = Number(row.original?.hook);
                    const validHook = isNaN(hook) ? 0 : Math.min(100, Math.max(0, hook));
                    return (
                        <span className="inline-flex flex-col items-end gap-1">
                            <span className="font-mono text-xs text-fg">{validHook}%</span>
                            <span className="h-[3px] w-14 overflow-hidden rounded-sm bg-surface-2">
                                <span
                                    className="block h-full rounded-sm bg-cyan"
                                    style={{ width: `${validHook}%` }}
                                />
                            </span>
                        </span>
                    );
                },
            },
            {
                id: "ctr",
                accessorKey: "ctr",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            CTR
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const ctr = Number(row.original?.ctr);
                    const validCtr = isNaN(ctr) ? 0 : ctr;
                    return (
                        <span className="font-mono text-[12.5px] text-fg tabular-nums">
                            {validCtr}%
                        </span>
                    );
                },
            },
            {
                id: "freq",
                accessorKey: "freq",
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <span
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                            className={cn(
                                "inline-flex cursor-pointer items-center gap-1 transition-colors",
                                isSorted ? "text-cyan" : "hover:text-fg-dim"
                            )}
                        >
                            Freq
                            {isSorted ? (isSorted === "desc" ? " ↓" : " ↑") : ""}
                        </span>
                    );
                },
                cell: ({ row }) => {
                    const freq = Number(row.original?.freq);
                    const validFreq = isNaN(freq) ? 0 : freq;
                    return (
                        <span
                            className={cn(
                                "font-mono text-[12.5px] tabular-nums",
                                validFreq >= 3.5 ? "font-bold text-neg" : "text-fg-mute"
                            )}
                        >
                            {validFreq.toFixed(1)}
                        </span>
                    );
                },
            },
            {
                id: "trend",
                header: "CTR · 7d",
                cell: ({ row }) => {
                    const trend = Array.isArray(row.original?.trend) && row.original.trend.length > 0
                        ? row.original.trend
                        : [0, 0, 0, 0, 0, 0, 0];
                    return (
                        <span className="flex justify-end">
                            <TrendSpark vals={trend} />
                        </span>
                    );
                },
            },
        ],
        []
    );

    // -------------------------------------------------------------------------
    // 7. Configure TanStack React Table Instance
    // -------------------------------------------------------------------------
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filteredRows,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // -------------------------------------------------------------------------
    // 8. Pagination Range Calculations
    // -------------------------------------------------------------------------
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const totalRows = filteredRows.length;
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return {
        table,
        columns,
        isLoading,
        fmt,
        setFmt,
        st,
        setSt,
        filteredRows,
        displaySpend,
        displayBlendedRoas,
        totalRows,
        startRow,
        endRow,
        pageSize,
    };
}

export default useCreativeTableData;