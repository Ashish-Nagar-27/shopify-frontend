import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtMoney, cn } from '@/lib/utils';

interface ReportSalesListPanelProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  salesData: any[] | null;
  onCustomerClick: (trackId: string, name: string) => void;
  onTrackIdClick: (trackId: string, name: string) => void;
}

export function ReportSalesListPanel({
  isLoading,
  isError,
  error,
  salesData,
  onCustomerClick,
  onTrackIdClick,
}: ReportSalesListPanelProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const formatOrderDate = (dateStr: string): string => {
    if (!dateStr) return '—';
    try {
      const isoStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return dateStr;
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'complete_name',
        accessorKey: 'complete_name',
        header: 'Name',
        cell: ({ row }) => {
          const sale = row.original;
          const customerName = sale?.complete_name || 'Customer';
          const trackId = sale?.trackid || '';

          return sale?.complete_name ? (
            <button
              onClick={() => onCustomerClick(trackId, customerName)}
              className="text-cyan text-left underline decoration-dotted underline-offset-[3px] hover:text-cyan-hover font-medium cursor-pointer focus:outline-none max-w-[160px] truncate block"
              title={`Open ${customerName}'s Profile`}
            >
              {customerName}
            </button>
          ) : (
            '—'
          );
        },
      },
      {
        id: 'email_phone',
        accessorKey: 'email_phone',
        header: 'Email/Phone',
        cell: ({ row }) => (
          <span className="text-fg-dim font-mono text-[12px]">
            {row.original?.email_phone || '—'}
          </span>
        ),
      },
      {
        id: 'total',
        accessorKey: 'total',
        header: 'Amount',
        accessorFn: (row) => Number(row.total || 0),
        cell: ({ row }) => (
          <span className="text-fg font-mono font-medium tabular-nums">
            {fmtMoney(row.original?.total)}
          </span>
        ),
      },
      {
        id: 'order_date',
        accessorKey: 'order_date',
        header: 'Received At',
        cell: ({ row }) => (
          <span className="text-fg-dim font-mono text-[12px]">
            {formatOrderDate(row.original?.order_date)}
          </span>
        ),
      },
      {
        id: 'trackid',
        accessorKey: 'trackid',
        header: 'User Journey',
        cell: ({ row }) => {
          const sale = row.original;
          const customerName = sale?.complete_name || 'Customer';
          const trackId = sale?.trackid || '';

          return (
            <div className="flex items-center gap-2">
              {trackId ? (
                <button
                  onClick={() => onTrackIdClick(trackId, customerName)}
                  className="text-cyan underline decoration-dotted underline-offset-[3px] hover:text-cyan-hover cursor-pointer font-mono font-medium text-[12px] focus:outline-none"
                  title={`Open ${customerName}'s Journey`}
                >
                  {trackId}
                </button>
              ) : (
                '—'
              )}
            </div>
          );
        },
      },
    ],
    [onCustomerClick, onTrackIdClick]
  );

  const data = useMemo(() => salesData || [], [salesData]);

  const table = useReactTable({
    data,
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

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = data.length;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Table skeleton header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.2fr_1.2fr] gap-4 pb-2 border-b border-border-soft">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-surface rounded animate-pulse" />
          ))}
        </div>
        {/* Table skeleton rows */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1.2fr_1.2fr] gap-4 py-3 border-b border-border-soft/50">
            <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
            <div className="h-4 bg-surface rounded animate-pulse w-5/6" />
            <div className="h-4 bg-surface rounded animate-pulse w-1/2" />
            <div className="h-4 bg-surface rounded animate-pulse w-2/3" />
            <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <div className="w-12 h-12 rounded-full bg-red-soft/20 border border-red-soft flex items-center justify-center text-red-500 mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-fg font-medium">Failed to load sales data</h3>
        <p className="text-fg-mute text-[13px] mt-1 max-w-[320px]">
          {error instanceof Error ? error.message : 'An unexpected error occurred while fetching details.'}
        </p>
      </div>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-fg-faint mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
        </div>
        <h3 className="text-fg font-medium">No sales recorded</h3>
        <p className="text-fg-mute text-[13px] mt-1">
          There are no detailed customer sales records for this ad entity.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border-soft rounded-[8px] bg-bg-overlay overflow-hidden">
      <Table className="w-full border-collapse text-left text-[13px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-surface border-b border-border-soft hover:bg-surface text-fg-dim font-medium">
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "px-5 py-3 font-sans font-medium text-fg-dim text-[13px] select-none cursor-pointer hover:text-fg transition-colors h-auto border-b border-border-soft",
                      header.column.id === 'total' && "text-right",
                      header.column.id === 'complete_name' && "w-[160px]"
                    )}
                  >
                    <div className={cn("inline-flex items-center gap-1.5", header.column.id === 'total' && "justify-end w-full")}>
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {isSorted === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-cyan" />
                      ) : isSorted === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-cyan" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-fg-dim/40 hover:text-fg-dim transition-colors" />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-border-soft/50">
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-surface-2/40 transition-[background] duration-150 border-b border-border-soft/50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "px-5 py-3",
                    cell.column.id === 'total' && "text-right"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-soft bg-surface px-5 py-3 text-[11px] text-fg-mute">
        <span className="font-mono text-fg-dim">
          {totalRows === 0 ? '0-0 of 0' : `${startRow}-${endRow} of ${totalRows}`}
        </span>

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
              {[ 15, 30, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* First / Prev / Next / Last navigation buttons */}
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
              title="First page"
            >
              {'|<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
              title="Previous page"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
              title="Next page"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="grid h-6 w-6 place-items-center rounded border border-border-soft bg-surface text-fg transition-colors hover:bg-surface-hi hover:text-fg disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
              title="Last page"
            >
              {'>|'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




