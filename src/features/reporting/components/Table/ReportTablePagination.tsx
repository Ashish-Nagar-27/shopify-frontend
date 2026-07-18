import { cn } from '@/lib/utils';
import { FILTER_OPTIONS } from '@/lib/data';
import * as Icon from '@/components/icons';
import type { FilterState } from '@/lib/types';
import type { Table } from '@tanstack/react-table';

interface ReportTablePaginationProps {
  filter: FilterState;
  table?: Table<any>;
}

export function ReportTablePagination({ filter, table }: ReportTablePaginationProps) {
  if (!table) {
    return null;
  }

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const handlePrev = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage();
    }
  };

  const handleNext = () => {
    if (table.getCanNextPage()) {
      table.nextPage();
    }
  };

  // Generate page numbers. Let's show up to 5 pages, centered on current page
  const maxButtons = 5;
  let pages: number[] = [];
  if (pageCount <= maxButtons) {
    pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  } else {
    let start = Math.max(0, pageIndex - 2);
    let end = Math.min(pageCount - 1, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(0, end - maxButtons + 1);
    }
    pages = Array.from({ length: end - start + 1 }, (_, i) => start + i + 1);
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft text-[12px] text-fg-mute">
      <span>
        Click{' '}
        <span style={{ color: 'var(--cyan)' }}>
          {FILTER_OPTIONS.clickHandling.find((o) => o.value === filter.clickHandling)?.label}
        </span>
        {' · '}Window{' '}
        <span style={{ color: 'var(--cyan)' }}>
          {FILTER_OPTIONS.window.find((o) => o.value === filter.window)?.label}
        </span>
        {' · '}Model{' '}
        <span style={{ color: 'var(--cyan)' }}>
          {FILTER_OPTIONS.model.find((o) => o.value === filter.model)?.label}
        </span>
      </span>
      <div className="flex items-center gap-1">
        <button
          className="w-7 h-7 rounded-[6px] grid place-items-center text-fg-mute text-[12px] font-mono hover:text-fg hover:bg-surface-2 transition-[color,background] duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Prev"
          disabled={!table.getCanPreviousPage()}
          onClick={handlePrev}
        >
          <Icon.chevron width="12" height="12" style={{ transform: 'rotate(180deg)' }} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => table.setPageIndex(p - 1)}
            className={cn(
              'w-7 h-7 rounded-[6px] grid place-items-center text-[12px] font-mono transition-[color,background] duration-[120ms] hover:text-fg hover:bg-surface-2',
              p === pageIndex + 1 ? 'text-cyan bg-cyan-soft' : 'text-fg-mute'
            )}
          >
            {p}
          </button>
        ))}
        <button
          className="w-7 h-7 rounded-[6px] grid place-items-center text-fg-mute text-[12px] font-mono hover:text-fg hover:bg-surface-2 transition-[color,background] duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next"
          disabled={!table.getCanNextPage()}
          onClick={handleNext}
        >
          <Icon.chevron width="12" height="12" />
        </button>
      </div>
    </div>
  );
}
