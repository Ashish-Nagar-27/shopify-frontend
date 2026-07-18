import { useMemo, useState, useCallback } from 'react';
import { cn, fmt, fmtMoney } from '@/lib/utils';
import { COL_BY_KEY, derived } from '@/lib/data';
import type { CampaignRow, FilterState, TabKey, ColumnDef } from '@/lib/types';
import { SrcIcon } from './SrcIcon';
import { StatusBadge } from './StatusBadge';
import * as Icon from '@/components/icons';
import { ReportSalesModal } from './ReportSalesModal';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import type { ColumnDef as ReactTableColumnDef, ExpandedState } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ReportTablePagination } from './ReportTablePagination';

function renderCell(
  row: CampaignRow,
  key: string,
  depth: number,
  expanded: boolean,
  onToggle: (() => void) | null,
  hasChildren: boolean,
  onSalesClick?: (row: CampaignRow) => void
): React.ReactNode {
  if (key === 'name') {
    return (
      <div className="inline-flex items-center gap-[10px] max-w-[360px]">
        {hasChildren ? (
          <button
            className={cn(
              'w-5 h-5 rounded-[5px] grid place-items-center text-fg-mute flex-shrink-0 transition-[transform,color,background] duration-150 hover:text-fg hover:bg-surface-2',
              expanded && 'rotate-90 text-cyan'
            )}
            onClick={onToggle ?? undefined}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <Icon.chevron width="12" height="12" />
          </button>
        ) : (
          <span style={{ width: 20, flexShrink: 0 }} />
        )}
        {depth === 0 && row.source && <SrcIcon src={row.source} />}
        <div className="overflow-hidden text-ellipsis">
          <span className="text-fg font-medium">{row.name}</span>
          {row.sub && <span className="text-fg-mute text-[11px] mt-[2px] block font-mono">{row.sub}</span>}
        </div>
      </div>
    );
  }
  if (key === 'status') {
    return row.status === undefined ? '—' : <StatusBadge s={row.status} />;
  }
  const v = derived(row, key);
  if (v === 0 && row.status === 'off') return <span className="text-fg-faint">—</span>;
  
  const lKey = key.toLowerCase();
  
  // Specific styling for platform sale/order links
  if (lKey === 'sales') {
    return (
      <span onClick={() => onSalesClick?.(row)} className="text-cyan underline decoration-dotted underline-offset-[3px] cursor-pointer">
        {fmt(v)}
      </span>
    );
  }
  
  // Multipliers (ROAS)
  if (lKey.includes('roas')) {
    return <span className={v >= 1 ? 'text-pos' : v > 0 ? '' : 'text-fg-mute'}>{v.toFixed(2)}×</span>;
  }
  
  // Percentages (CTR, CR, Margin %, etc.)
  if (lKey.includes('%') || lKey.includes('pct') || lKey.includes('ctr') || lKey.includes('cr')) {
    return v.toFixed(2) + '%';
  }
  
  // Specific currency fields that have ₹ prefix (Revenue/Profit/AOV fields)
  if (lKey === 'rev' || lKey === 'revenue' || lKey.includes('profit') || lKey === 'cancelrev' || lKey === 'rrevenue' || lKey === 'nrevenue' || lKey === 'reported rev') {
    return '₹' + fmt(v);
  }
  if (lKey === 'aov' || lKey === 'naov' || lKey === 'ltv') {
    return '₹' + fmtMoney(v);
  }
  
  // Other currency fields (Cost/Spend/CPA/CPC/CPM/CPL/eCPNV)
  if (
    lKey === 'spend' || lKey === 'nspend' || lKey === 'cost' ||
    lKey.includes('cpa') || lKey.includes('cpc') || lKey.includes('cpm') || lKey.includes('cpl') ||
    lKey === 'ecpnv'
  ) {
    return fmtMoney(v);
  }
  
  // Decimal fields (Frequency, average touch count, etc.)
  if (lKey === 'frequency' || lKey === 'avg_touches_per_order' || lKey === 'total_touch_count') {
    return v.toFixed(1);
  }
  
  // Traffic score
  if (lKey === 'trafficscore') {
    return <span className={v >= 70 ? 'text-pos' : v >= 50 ? '' : 'text-fg-mute'}>{v}</span>;
  }
  
  return fmt(v);
}

function renderTotal(key: string, rawRows: CampaignRow[]): React.ReactNode {
  if (key === 'name') return null;
  if (key === 'status') return <span className="text-fg-mute">—</span>;
  
  const lKey = key.toLowerCase();
  
  // Average keys: percentage metrics, unit metrics (ROAS, CPA, CPC, CPM, CPL, AOV, LTV, Frequency, Traffic Score)
  const isAvg = 
    lKey.includes('%') || 
    lKey.includes('pct') || 
    lKey.includes('ctr') || 
    lKey.includes('cr') ||
    lKey.includes('roas') || 
    lKey.includes('cpa') || 
    lKey.includes('cpc') || 
    lKey.includes('cpm') || 
    lKey.includes('cpl') || 
    lKey.includes('aov') || 
    lKey === 'ltv' || 
    lKey === 'frequency' || 
    lKey === 'avg_touches_per_order' || 
    lKey === 'trafficscore' ||
    lKey === 'ecpnv';

  if (isAvg) {
    let weighted = 0, count = 0;
    rawRows.forEach((r) => {
      weighted += derived(r, key) || 0;
      count++;
    });
    const v = count ? weighted / count : 0;
    
    if (lKey.includes('%') || lKey.includes('pct') || lKey.includes('ctr') || lKey.includes('cr')) {
      return v.toFixed(2) + '%';
    }
    if (lKey.includes('roas')) {
      return v.toFixed(2) + '×';
    }
    if (lKey === 'frequency' || lKey === 'avg_touches_per_order') {
      return v.toFixed(1);
    }
    if (lKey === 'aov' || lKey === 'naov' || lKey === 'ltv') {
      return '₹' + fmtMoney(v);
    }
    return fmtMoney(v);
  } else {
    // Sum keys: spend, revenue, sales, impressions, clicks, reach, video views, leads, cancel counts, etc.
    let sum = 0;
    rawRows.forEach((r) => {
      sum += derived(r, key) || 0;
    });
    if (lKey === 'rev' || lKey === 'revenue' || lKey.includes('profit') || lKey === 'cancelrev' || lKey === 'rrevenue' || lKey === 'nrevenue' || lKey === 'reported rev') {
      return '₹' + fmt(sum);
    }
    return fmt(sum);
  }
}

interface ReportTableProps {
  rows: CampaignRow[];
  loading: boolean;
  visibleCols: ColumnDef[];
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: string) => void;
  expanded: ExpandedState;
  onExpandedChange: React.Dispatch<React.SetStateAction<ExpandedState>>;
  tab: TabKey;
  tabSelected: Record<string, boolean>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  allSelectedOnPage: boolean;
  someSelectedOnPage: boolean;
  filter: FilterState;
}

export function ReportTable({
  rows,
  loading,
  visibleCols,
  sortKey,
  sortDir,
  onSort,
  expanded,
  onExpandedChange,
  tab,
  tabSelected,
  onToggleRow,
  onToggleAll,
  allSelectedOnPage,
  someSelectedOnPage,
  filter
}: ReportTableProps) {
  const isCheckable = tab === 'campaign' || tab === 'adset';

  const [selectedSalesRow, setSelectedSalesRow] = useState<CampaignRow | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

  const handleSalesClick = useCallback((row: CampaignRow) => {
    setSelectedSalesRow(row);
    setIsSalesModalOpen(true);
  }, []);

  const tdCls = (key: string, rowState?: 'hover' | 'expanded' | 'child') =>
    cn(
      'border-b border-border-soft whitespace-nowrap',
      key === 'name' ? 'text-left pl-5 font-sans' : 'text-right px-[14px] font-mono tabular-nums text-fg',
      // COL_BY_KEY[key]?.align === 'center' && 'text-center',
      COL_BY_KEY[key]?.align ? `text-${COL_BY_KEY[key]?.align}` : 'text-center',
      rowState === 'expanded' && 'bg-bg-row-expand',
      rowState === 'child' && 'bg-bg-row-child text-[12px]'
    );

  const fullCols = useMemo<ColumnDef[]>(() => {
    const rawCols = [COL_BY_KEY['name'], COL_BY_KEY['status'], ...visibleCols].filter(Boolean);
    const seen = new Set<string>();
    return rawCols.filter((col) => {
      if (seen.has(col.key)) return false;
      seen.add(col.key);
      return true;
    });
  }, [visibleCols]);

  const tableColumns = useMemo<ReactTableColumnDef<CampaignRow>[]>(() => {
    return fullCols.map((colDef) => {
      const key = colDef.key;
 
      return {
        id: key,
        accessorFn: (row) => derived(row, key),
        header: () => (
          <>
            {colDef.label}
            {colDef.info && (
              <Tooltip>
                <TooltipTrigger>
                  <span style={{ marginLeft: 4, color: 'var(--fg-faint)', cursor: 'help' }}>ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{colDef.infoText || "Information"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {sortKey === colDef.key && (
              <span className="text-cyan ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
            )}
          </>
        ),
        cell: ({ row }) => {
          return renderCell(
            row.original,
            key,
            row.depth,
            row.getIsExpanded(),
            row.getCanExpand() ? () => row.toggleExpanded() : null,
            row.getCanExpand(),
            handleSalesClick
          );
        },
      };
    });
  }, [fullCols, sortKey, sortDir, handleSalesClick]);

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: {
      expanded, 
    },
    initialState: {
    pagination: {
      pageIndex: 0, //custom initial page index
      pageSize: 10, //custom default page size
    },
  },
    getRowId: (row) => row.id,
    onExpandedChange: onExpandedChange,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
     getPaginationRowModel: getPaginationRowModel()
  });



  return (
    <>
    <Table className="border-separate border-spacing-0 text-[13px]">
      <TableHeader className="bg-transparent border-0 [&_tr]:border-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent">
            {isCheckable && (
              <TableHead className="sticky top-0 bg-bg-panel w-[44px] pl-5 text-left border-b border-border-soft h-auto py-3">
                <span
                  style={{
                    display: 'inline-grid',
                    placeItems: 'center',
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${allSelectedOnPage ? 'var(--cyan)' : 'var(--border)'}`,
                    background: allSelectedOnPage ? 'var(--cyan)' : 'transparent',
                    cursor: 'pointer',
                    color: 'oklch(0.10 0.018 240)',
                  }}
                  onClick={onToggleAll}
                  role="checkbox"
                  aria-checked={allSelectedOnPage}
                >
                  {allSelectedOnPage && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5 9-11" />
                    </svg>
                  )}
                  {!allSelectedOnPage && someSelectedOnPage && (
                    <span style={{ width: 8, height: 2, background: 'var(--cyan)', borderRadius: 1 }} />
                  )}
                </span>
              </TableHead>
            )}
            {headerGroup.headers.map((header) => {
              const key = header.id;
              const c = COL_BY_KEY[key];
              if (!c) return null;
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    'sticky top-0 bg-bg-panel text-[10px] font-semibold tracking-[0.12em]  text-fg-mute px-[14px] py-3 border-b border-border-soft whitespace-nowrap font-sans h-auto',
                    c.align === 'center' ? 'text-center' : 'text-right',
                    c.key === 'name' && 'text-left pl-5',
                    (c.num || c.sortable) && 'cursor-pointer select-none hover:text-fg'
                  )}
                  style={{ minWidth: c.width }}
                  onClick={() => (c.num || c.sortable) && onSort(c.key)}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <TableRow
              key={`loading-${idx}`}
              className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent"
            >
              {isCheckable && (
                <TableCell
                  className="border-b border-border-soft pl-5  bg-transparent"
                  style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}
                >
                  <Skeleton className="w-[18px] h-[18px] rounded-[5px]" />
                </TableCell>
              )}
              {fullCols.map((col) => (
                <TableCell
                  key={`loading-${idx}-${col.key}`}
                  className={cn(
                    'border-b border-border-soft whitespace-nowrap p-0',
                    col.key === 'name' ? 'text-left pl-5' : 'text-right px-[14px]'
                  )}
                  style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}
                >
                  <Skeleton className={cn('h-4 rounded-[4px] inline-block', col.key === 'name' ? 'w-48' : 'w-16')} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table?.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, rowIndex) => {
            const isChild = row.depth > 0;
            const rowState = isChild ? 'child' : row.getIsExpanded() ? 'expanded' : undefined;
            return (
              <TableRow
                key={`${row.id}-${row.depth}-${rowIndex}`}
                className="group border-0 hover:bg-transparent data-[state=selected]:bg-transparent"
              >
                {isCheckable && (
                  <TableCell
                    className={cn(
                      'border-b border-border-soft pl-5 ',
                      isChild ? 'bg-bg-row-child' : 'group-hover:bg-bg-row-hover'
                    )}
                    style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}
                  >
                    {!isChild && (
                      <span
                        style={{
                          display: 'inline-grid',
                          placeItems: 'center',
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          border: `1.5px solid ${tabSelected[row.id] ? 'var(--cyan)' : 'var(--border)'}`,
                          background: tabSelected[row.id] ? 'var(--cyan)' : 'transparent',
                          cursor: 'pointer',
                          color: 'oklch(0.10 0.018 240)',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRow(row.id);
                        }}
                        role="checkbox"
                        aria-checked={!!tabSelected[row.id]}
                      >
                        {tabSelected[row.id] && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 12 5 5 9-11" />
                          </svg>
                        )}
                      </span>
                    )}
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell, ci) => {
                  const key = cell.column.id;
                  return (
                    <TableCell
                      key={`${cell.id}-${ci}`}
                      className={cn(
                        tdCls(key, rowState),
                        ci === 0 && isChild && 'pl-[50px]',
                        'group-hover:bg-bg-row-hover p-0'
                      )}
                      style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <TableRow className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent">
            <TableCell
              colSpan={fullCols.length + (isCheckable ? 1 : 0)}
              className="h-24 text-center text-fg-mute font-sans border-b border-border-soft bg-transparent"
            >
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter className="bg-transparent border-0 [&>tr]:last:border-b-0">
        <TableRow className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent">
          {isCheckable && (
            <TableCell className="px-[14px] py-[14px] bg-bg-footer border-t border-border font-mono tabular-nums text-right font-semibold text-fg text-[13px] border-b-0" />
          )}
          {fullCols.map((col, i) => (
            <TableCell
              key={col.key}
              className={cn(
                'px-[14px] py-[14px] bg-bg-footer border-t border-border font-mono tabular-nums text-right font-semibold text-fg text-[13px] border-b-0',
                col.align === 'center' ? `text-center` : 'text-center',
                i === 0 && 'text-left pl-5 font-sans uppercase text-[11px] tracking-[0.12em] text-fg-mute'
              )}
            >
              {i === 0
                ? `Totals · ${rows.length} ${
                    tab === 'campaign' ? 'campaigns' : tab === 'adset' ? 'ad sets' : 'ads'
                  }`
                : renderTotal(col.key, rows)}
            </TableCell>
          ))}
        </TableRow>

      </TableFooter>

    </Table>

    {/* Reporting Table Pagination */}
     <ReportTablePagination filter={filter} table={table} />

     <ReportSalesModal
       open={isSalesModalOpen}
       onClose={() => setIsSalesModalOpen(false)}
       row={selectedSalesRow}
       tab={tab}
     />
    </>
  );
}
