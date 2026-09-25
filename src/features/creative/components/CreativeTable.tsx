import { flexRender } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FMT_FILTERS, ST_FILTERS } from "../data/creatives";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtC } from "../utils/format";
import { useCreativeTableData } from "../hooks/useCreativeTableData";

/**
 * CreativeTable Component
 * 
 * Renders the main Facebook Creatives table view including:
 * 1. Header with title and spending summary.
 * 2. Format (Video/Static/Carousel) and Status (Winner/Fatiguing/Testing/Kill) filter pill bars.
 * 3. Data table with custom sortable column headers, custom cell formatters, and sparklines.
 * 4. Animated skeleton loaders during API fetch.
 * 5. Footer with blended ROAS and pagination controls.
 */
export function CreativeTable() {
    // Consume state, table instance, and normalized data from useCreativeTableData hook
    const {
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
    } = useCreativeTableData();

    return (
        <div className="rounded-xl border border-border-soft bg-surface shadow-card overflow-hidden">
            {/* ========================================================================= */}
            {/* 1. TABLE TITLE HEADER                                                     */}
            {/* ========================================================================= */}
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
                <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-mute">
                    All Creatives · <span className="text-cyan">Facebook</span>
                </h3>
            </div>

            {/* ========================================================================= */}
            {/* 2. FILTER PILLS & SUMMARY STATS BAR                                       */}
            {/* ========================================================================= */}
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border-soft px-5 py-3.5">
                {/* Format Filters (All, Video, Static, Carousel) */}
                <div className="flex gap-1 rounded-lg border border-border-soft bg-bg-deep p-[3px]">
                    {FMT_FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFmt(f)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                                fmt === f ? "bg-surface-hi text-fg" : "text-fg-mute hover:text-fg-dim"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Status Filters (All, Winner, Fatiguing, Testing, Kill) */}
                <div className="flex gap-1 rounded-lg border border-border-soft bg-bg-deep p-[3px]">
                    {ST_FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setSt(f)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                                st === f ? "bg-surface-hi text-fg" : "text-fg-mute hover:text-fg-dim"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Total filtered count & total spend summary */}
                <span className="ml-auto font-mono text-[11.5px] text-fg-mute">
                    {filteredRows.length} creatives · {fmtC(displaySpend)} spend
                </span>
            </div>

            {/* ========================================================================= */}
            {/* 3. MAIN CREATIVES DATA TABLE                                             */}
            {/* ========================================================================= */}
            <Table className="w-full border-separate border-spacing-0">
                {/* Table Header */}
                <TableHeader className="bg-transparent border-0 [&_tr]:border-0">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="sticky top-0 z-[2] border-b border-border-soft bg-surface hover:bg-transparent data-[state=selected]:bg-transparent"
                        >
                            {headerGroup.headers.map((header) => {
                                const key = header.id;
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={cn(
                                            "border-b border-border-soft bg-surface h-auto px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-fg-mute whitespace-nowrap",
                                            key === "name" || key === "status" ? "text-left" : "text-right",
                                            key === "name" && "pl-5",
                                            key === "trend" && "pr-5"
                                        )}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                {/* Table Body (Loading Skeletons | Data Rows | Empty State) */}
                <TableBody>
                    {isLoading ? (
                        /* Skeleton pulse loaders rendered while API is loading */
                        Array.from({ length: 5 }).map((_, idx) => (
                            <TableRow key={idx} className="border-b border-border-soft">
                                <TableCell className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-lg bg-surface-2" />
                                        <div className="flex flex-col gap-1.5">
                                            <Skeleton className="h-4 w-44 bg-surface-2" />
                                            <Skeleton className="h-3 w-20 bg-surface-2" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-5 w-16 rounded-full bg-surface-2" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-16 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-16 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-12 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-16 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-5 w-20 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-12 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-4 w-10 bg-surface-2 ml-auto" /></TableCell>
                                <TableCell className="px-5 py-3"><Skeleton className="h-6 w-20 bg-surface-2 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows?.length ? (
                        /* Render active page rows */
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="border-b border-border-soft hover:bg-[oklch(0.20_0.022_235)] transition-colors last:border-b-0 data-[state=selected]:bg-transparent"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const key = cell.column.id;
                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "border-b border-border-soft px-5 py-2.5 text-[12.5px] align-middle whitespace-nowrap",
                                                key === "name" || key === "status" ? "text-left" : "text-right",
                                                key === "name" && "pl-5",
                                                key === "trend" && "pr-5"
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        /* Empty state when no items match filters */
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-fg-mute"
                            >
                                No creatives found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* ========================================================================= */}
            {/* 4. TABLE FOOTER & PAGINATION BAR                                         */}
            {/* ========================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[oklch(0.17_0.02_235)] px-5 py-3 text-[11px] text-fg-mute">
                {/* Blended ROAS Indicator */}
                <div className="flex items-center gap-4">
                    <span>Freq ≥ 3.5 flagged red · trend = daily CTR, last 7 days</span>
                    <span className="font-mono text-fg-dim">
                        Blended ROAS {displayBlendedRoas.toFixed(2)}×
                    </span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                    {/* Rows per page dropdown */}
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="rounded border border-border-soft bg-surface px-2 py-1 font-mono text-[11px] text-fg focus:outline-none focus:border-cyan cursor-pointer"
                        >
                            {[10, 15, 20, 30, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination range display (e.g. 1-10 of 42) */}
                    <span className="font-mono text-fg-dim">
                        {totalRows === 0 ? "0-0 of 0" : `${startRow}-${endRow} of ${totalRows}`}
                    </span>

                    {/* First / Prev / Next / Last navigation buttons */}
                    <div className="flex items-center gap-1 font-mono">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                            title="First page"
                        >
                            {"|<"}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                            title="Previous page"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                            title="Next page"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                            title="Last page"
                        >
                            {">|"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreativeTable;
