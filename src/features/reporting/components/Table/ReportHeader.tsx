import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FILTER_DEFAULTS } from '@/lib/data';
import type { FilterState, ColumnDef, CampaignRow, TabKey } from '@/lib/types';
import { ColumnsMenu } from './ColumnsMenu';
import { FilterPopover } from './FilterPopover';
import * as Icon from '@/components/icons';
import { ExportReportButton } from './ExportReportButton';

const ctrlBase = 'inline-flex items-center gap-2 h-9 px-3 bg-surface border border-border-soft rounded-[10px] text-fg-dim text-[13px] transition-[border-color,color,background] duration-150 hover:border-border hover:text-fg';

interface ReportHeaderProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  activePreset: string;
  onApplyPreset: (presetName: string) => void;
  onCustomise: () => void;
  rows: CampaignRow[];
  tab: TabKey;
  adaptedData: {
    campaign: CampaignRow[];
    adset: CampaignRow[];
    ad: CampaignRow[];
  };
  visibleCols: ColumnDef[];
}

export function ReportHeader({
  filter,
  onFilterChange,
  activePreset,
  onApplyPreset,
  onCustomise,
  rows,
  tab,
  adaptedData,
  visibleCols,
}: ReportHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const colsBtnRef = useRef<HTMLButtonElement>(null);

  const filterCount = Object.keys(FILTER_DEFAULTS).filter(
    (k) => filter[k as keyof FilterState] !== FILTER_DEFAULTS[k as keyof FilterState]
  ).length;

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
      <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-fg-mute m-0">
        Attribute Report · <span className="text-cyan">All Sources</span>
      </h3>
      <div className="inline-flex gap-2 items-center">
        <div style={{ position: 'relative' }}>
          <button
            ref={filterBtnRef}
            className={cn(ctrlBase, filterOpen && 'border-cyan-deep text-cyan')}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <Icon.filter width="14" height="14" /> Filter
            {filterCount > 0 && (
              <span style={{ color: 'var(--cyan)', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700 }}>
                {filterCount}
              </span>
            )}
          </button>
          <FilterPopover
            open={filterOpen}
            anchorRef={filterBtnRef}
            onClose={() => setFilterOpen(false)}
            value={filter}
            onApply={(val) => {
              onFilterChange(val);
              setFilterOpen(false);
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <button
            ref={colsBtnRef}
            className={cn(ctrlBase, colsMenuOpen && 'border-cyan-deep text-cyan')}
            onClick={() => setColsMenuOpen((o) => !o)}
          >
            <Icon.columns width="14" height="14" /> Columns
          </button>
          <ColumnsMenu
            open={colsMenuOpen}
            anchorRef={colsBtnRef}
            onClose={() => setColsMenuOpen(false)}
            currentPreset={activePreset}
            onApplyPreset={onApplyPreset}
            onCustomise={() => {
              onCustomise();
              setColsMenuOpen(false);
            }}
          />
        </div>
        <ExportReportButton
          rows={rows}
          tab={tab}
          adaptedData={adaptedData}
          visibleCols={visibleCols}
        />
      </div>
    </div>
  );
}
