import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ALL_COLUMNS, COL_BY_KEY, DEFAULT_VISIBLE } from '@/lib/data';
import type { ColumnDef, CampaignRow, TabKey } from '@/lib/types';
import * as Icon from '@/components/icons';
import { exportReportToExcel } from '../../../utils/exportReport';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
  visibleCols: ColumnDef[];
  rows: CampaignRow[];
  tab: TabKey;
  adaptedData: {
    campaign: CampaignRow[];
    adset: CampaignRow[];
    ad: CampaignRow[];
  };
}

export function ExportReportModal({
  open,
  onClose,
  visibleCols,
  rows,
  tab,
  adaptedData,
}: ExportReportModalProps) {
  const [selected, setSelected] = useState<ColumnDef[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [includeCampaign, setIncludeCampaign] = useState(true);
  const [includeAdset, setIncludeAdset] = useState(true);
  const [includeAd, setIncludeAd] = useState(true);
  const [includeStatus, setIncludeStatus] = useState(true);

  // Initialize selected columns to the table's current visible columns
  useEffect(() => {
    if (open) {
      setSelected(visibleCols.filter(c => c.key !== 'name' && c.key !== 'status'));
      setSearch('');
      setActiveTab('all');
      setIncludeCampaign(true);
      setIncludeAdset(true);
      setIncludeAd(true);
      setIncludeStatus(true);
    }
  }, [open, visibleCols]);

  if (!open) return null;

  const defaultsKeys = new Set(DEFAULT_VISIBLE);
  const EXPORTABLE_COLUMNS = ALL_COLUMNS.filter(c => c.key !== 'name' && c.key !== 'status');
  const DEFAULT_VISIBLE_COLUMNS = DEFAULT_VISIBLE.filter(k => k !== 'name' && k !== 'status');

  const tabFiltered = EXPORTABLE_COLUMNS.filter(c => {
    if (activeTab === 'defaults') return defaultsKeys.has(c.key);
    if (activeTab === 'custom') return !defaultsKeys.has(c.key);
    return true;
  }).filter(c => !search || c.label.toLowerCase().includes(search.toLowerCase()));

  const toggle = (key: string) => {
    const col = COL_BY_KEY[key];
    if (!col) return;
    setSelected(s => s.some(c => c.key === key) ? s.filter(c => c.key !== key) : [...s, col]);
  };

  const handleExport = () => {
    console.log('adaptedData', adaptedData)
    console.log('includeCampaignName: includeCampaign', includeCampaign)
    console.log('includeAdsetName: includeAdset', includeAdset)
    console.log('includeAdName: includeAd', includeAd)
    console.log('includeStatus: includeStatus', includeStatus)
    console.log('visibleCols: selected', selected)


    exportReportToExcel({
      rows,
      tab,
      adaptedData,
      visibleCols: selected,
      includeCampaignName: includeCampaign,
      includeAdsetName: includeAdset,
      includeAdName: includeAd,
      includeStatus: includeStatus,
    });
    // onClose();
  };

  const tabCls = (k: string) => cn(
    'px-3 py-[6px] bg-surface border border-border-soft rounded-[7px] text-[12px] text-fg-dim font-medium inline-flex items-center gap-1 transition-all duration-[120ms] hover:border-border cursor-pointer',
    activeTab === k && 'bg-cyan-soft border-cyan-deep text-cyan',
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-bg-deep border border-border-soft">
        {/* Header */}
        <DialogHeader className="px-5 py-[14px] border-b border-border-soft bg-[linear-gradient(180deg,oklch(0.18_0.02_235),var(--bg-deep))] flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-[16px] font-semibold text-fg tracking-[-0.01em]">
            Export Report
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-[10px] min-h-0">
          {/* Description */}
          <p className="text-[13px] text-fg-dim mb-1">
            Choose the columns you want to export. Include at least one of: Campaign Name, Ad Set Name, or Ad Name.
          </p>

          {/* Identity/Hierarchy Columns */}
          <div className="flex flex-col gap-2 p-3 bg-surface border border-border-soft rounded-[9px]">
            <span className="text-[11px] font-bold text-fg-mute tracking-[0.08em] uppercase">Identity Columns to Include</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-[13px] text-fg-dim hover:bg-bg-overlay transition-colors text-left cursor-pointer"
                onClick={() => setIncludeCampaign(!includeCampaign)}
              >
                <span className={cn(
                  'w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center text-[oklch(0.10_0.018_240)] transition-all duration-[120ms] shrink-0',
                  includeCampaign ? 'bg-cyan border-cyan' : 'border-border',
                )}>
                  {includeCampaign && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5 9-11"/>
                    </svg>
                  )}
                </span>
                <span>Campaign Name</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-[13px] text-fg-dim hover:bg-bg-overlay transition-colors text-left cursor-pointer"
                onClick={() => setIncludeAdset(!includeAdset)}
              >
                <span className={cn(
                  'w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center text-[oklch(0.10_0.018_240)] transition-all duration-[120ms] shrink-0',
                  includeAdset ? 'bg-cyan border-cyan' : 'border-border',
                )}>
                  {includeAdset && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5 9-11"/>
                    </svg>
                  )}
                </span>
                <span>Ad Set Name</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-[13px] text-fg-dim hover:bg-bg-overlay transition-colors text-left cursor-pointer"
                onClick={() => setIncludeAd(!includeAd)}
              >
                <span className={cn(
                  'w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center text-[oklch(0.10_0.018_240)] transition-all duration-[120ms] shrink-0',
                  includeAd ? 'bg-cyan border-cyan' : 'border-border',
                )}>
                  {includeAd && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5 9-11"/>
                    </svg>
                  )}
                </span>
                <span>Ad Name</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-[13px] text-fg-dim hover:bg-bg-overlay transition-colors text-left cursor-pointer"
                onClick={() => setIncludeStatus(!includeStatus)}
              >
                <span className={cn(
                  'w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center text-[oklch(0.10_0.018_240)] transition-all duration-[120ms] shrink-0',
                  includeStatus ? 'bg-cyan border-cyan' : 'border-border',
                )}>
                  {includeStatus && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5 9-11"/>
                    </svg>
                  )}
                </span>
                <span>Status (optional)</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-[10px] h-10 px-3 bg-surface border border-border-soft rounded-[9px]">
            <Icon.search width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
            <input
              className="flex-1 border-none outline-none bg-transparent text-[13px] text-fg"
              placeholder="Search columns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>



          {/* Columns Checkbox List */}
          <div className="overflow-y-auto border border-border-soft rounded-[9px] bg-bg-overlay p-1 max-h-[300px] min-h-[200px]">
            {tabFiltered.map(col => {
              const checked = selected.some(c => c.key === col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  className="grid grid-cols-[22px_1fr_auto] items-center gap-3 px-[10px] py-[9px] rounded-[6px] text-[13px] text-fg-dim text-left w-full transition-[background] duration-[120ms] hover:bg-surface hover:text-fg cursor-pointer"
                  onClick={() => toggle(col.key)}>
                  <span className={cn(
                    'w-[18px] h-[18px] rounded-[5px] border-[1.5px] grid place-items-center text-[oklch(0.10_0.018_240)] transition-all duration-[120ms]',
                    checked ? 'bg-cyan border-cyan' : 'border-border',
                  )}>
                    {checked && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5 9-11"/>
                      </svg>
                    )}
                  </span>
                  <span>{col.label}</span>
                  <span style={{ color: 'var(--fg-faint)', fontSize: 11 }}>{col.group}</span>
                </button>
              );
            })}
            {tabFiltered.length === 0 && (
              <div style={{ padding: '16px', color: 'var(--fg-mute)', fontSize: 13, textAlign: 'center' }}>
                No columns match &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-[14px] border-t border-border-soft bg-bg-overlay">
          <span className="text-[12px] text-fg-mute">
            {selected.length} of {EXPORTABLE_COLUMNS.length} columns selected
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              className="h-9 px-4 bg-surface border border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium hover:text-fg hover:border-border transition-[color,border-color] duration-[120ms] cursor-pointer"
              onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!includeCampaign && !includeAdset && !includeAd}
              className="h-9 px-[18px] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] rounded-[8px] text-[13px] font-semibold hover:brightness-[1.08] transition-[filter,opacity] duration-[120ms] cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleExport}>
              <Icon.download width="14" height="14" />
              Export
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
