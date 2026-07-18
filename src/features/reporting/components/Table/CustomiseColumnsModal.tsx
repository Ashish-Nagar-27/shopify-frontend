import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ALL_COLUMNS, COL_BY_KEY, DEFAULT_VISIBLE } from '@/lib/data';
import type { ColumnDef } from '@/lib/types';
import * as Icon from '@/components/icons';
import { SortableColumnsList } from './SortableColumnsList';
import { ColumnViewsSidebar } from './ColumnViewsSidebar';
import { useQuery } from '@tanstack/react-query';
import { reportingApi } from '../../api/reportingApi';

interface Props {
  open: boolean;
  initialSelected: ColumnDef[];
  onClose: () => void;
  onApply: (keys: ColumnDef[], viewName?: string) => void;
  views?: string[];
  currentView?: string;
  onSavePreset?: (presetName: string, selectedCols: ColumnDef[]) => void;
  onDeletePreset?: (presetName: string) => void;
}

export function CustomiseColumnsModal({
  open,
  initialSelected,
  onClose,
  onApply,
  views,
  currentView,
  onSavePreset,
  onDeletePreset,
}: Props) {
  const [selected, setSelected] = useState<ColumnDef[]>(initialSelected);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('all');
  const [view, setView]         = useState(currentView || 'myview');
  console.log('view ', view, views)

  const { data: viewColumnsData, isFetching: isFetchingViewColumns } = useQuery({
    queryKey: ["reportingCustomizedColumns", view],
    queryFn: () => reportingApi.getCustomizedColumns(view),
    enabled: open && !!view,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (viewColumnsData?.data) {
      let cols = [...viewColumnsData.data]
        .sort((a, b) => a.seq - b.seq)
        .map(item => COL_BY_KEY[item.field])
        .filter(Boolean) as ColumnDef[];

      // Filter out name and status completely
      cols = cols.filter(c => c.key !== 'name' && c.key !== 'status');

      setSelected(cols);
    }
  }, [viewColumnsData]);

  useEffect(() => {
    if (currentView) {
      setView(currentView);
    }
  }, [currentView]);

  useEffect(() => {
    if (open) {
      setSelected(initialSelected.filter(c => c.key !== 'name' && c.key !== 'status'));
      setSearch('');
      setTab('all');
      if (currentView) setView(currentView);
    }
  }, [open, initialSelected, currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const defaultsKeys = new Set(DEFAULT_VISIBLE);
  const tabFiltered = ALL_COLUMNS.filter(c => {
    if (tab === 'defaults') return defaultsKeys.has(c.key);
    if (tab === 'custom')   return !defaultsKeys.has(c.key);
    return true;
  }).filter(c => !search || c.label.toLowerCase().includes(search.toLowerCase()));

  const toggle = (key: string) => {
    const col = COL_BY_KEY[key];
    if (!col || col.required) return;
    setSelected(s => s.some(c => c.key === key) ? s.filter(c => c.key !== key) : [...s, col]);
  };

  const remove = (key: string) => {
    const col = COL_BY_KEY[key];
    if (col?.required) return;
    setSelected(s => s.filter(c => c.key !== key));
  };

  const tabCls = (k: string) => cn(
    'px-3 py-[6px] bg-surface border border-border-soft rounded-[7px] text-[12px] text-fg-dim font-medium inline-flex items-center gap-1 transition-all duration-[120ms] hover:border-border',
    tab === k && 'bg-cyan-soft border-cyan-deep text-cyan',
  );
  console.log('view-currentView-views=', view, '-', currentView , '-', views)
  return (
    <div
      className="fixed inset-0 z-[100] bg-[oklch(0_0_0/0.5)] [backdrop-filter:blur(6px)] grid place-items-center p-6 [animation:modal-veil-in_0.18s_ease]"
      onClick={onClose}>
      <div
        className="bg-bg-deep border border-border rounded-[16px] shadow-[0_40px_80px_-20px_oklch(0_0_0/0.8)] overflow-hidden flex flex-col w-[min(1200px,calc(100vw-48px))] h-[min(720px,calc(100vh-48px))] [animation:modal-in_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-[14px] border-b border-border-soft bg-[linear-gradient(180deg,oklch(0.18_0.02_235),var(--bg-deep))]">
          <h2 className="text-[16px] font-semibold m-0 text-fg tracking-[-0.01em]">Customise Columns</h2>
          <button
            className="w-[30px] h-[30px] rounded-[7px] grid place-items-center text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms]"
            onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M6 18 18 6"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-[200px_1fr_300px] flex-1 min-h-0">

          {/* Left: Views */}
          <ColumnViewsSidebar
            views={views}
            activeView={view}
            onViewChange={setView}
            onSavePreset={(presetName) => onSavePreset?.(presetName, selected)}
            onDeleteView={onDeletePreset}
            currentView={currentView}
          />

          {/* Middle: searchable list */}
          <div className="px-5 py-4 flex flex-col gap-[10px] min-h-0">
            <div className="flex items-center gap-[10px] h-10 px-3 bg-surface border border-border-soft rounded-[9px]">
              <Icon.search width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
              <input
                className="flex-1 border-none outline-none bg-transparent text-[13px] text-fg"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-[6px] flex-wrap">
              <button className={tabCls('all')}     onClick={() => setTab('all')}>All <span>({ALL_COLUMNS.length})</span></button>
              <button className={tabCls('custom')}  onClick={() => setTab('custom')}>Custom <span>({ALL_COLUMNS.length - DEFAULT_VISIBLE.length})</span></button>
              <button className={tabCls('defaults')} onClick={() => setTab('defaults')}>Defaults <span>({DEFAULT_VISIBLE.length})</span></button>
            </div>
            <div className="flex-1 overflow-y-auto border border-border-soft rounded-[9px] bg-bg-overlay p-1 min-h-0">
              {tabFiltered.map(col => {
                const checked = selected.some(c => c.key === col.key);
                return (
                  <button
                    key={col.key}
                    className="grid grid-cols-[22px_1fr_auto] items-center gap-3 px-[10px] py-[9px] rounded-[6px] text-[13px] text-fg-dim text-left w-full transition-[background] duration-[120ms] hover:bg-surface hover:text-fg"
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

          {/* Right: selected (sortable) */}
          {isFetchingViewColumns ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-border-soft rounded-[9px] bg-bg-overlay p-4 min-h-0">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-[3px] border-cyan/20 border-t-cyan animate-spin" />
                <span className="text-[12px] text-fg-mute font-medium">Loading columns...</span>
              </div>
            </div>
          ) : (
            <SortableColumnsList
              selected={selected}
              onReorder={setSelected}
              onRemove={remove}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-[14px] border-t border-border-soft bg-bg-overlay">
          <span className="text-[12px] text-fg-mute">
            Drag handle on right column to reorder · {selected.length} of {ALL_COLUMNS.length} columns
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="h-9 px-4 bg-surface border border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium hover:text-fg hover:border-border transition-[color,border-color] duration-[120ms]"
              onClick={onClose}>
              Cancel
            </button>
            <button
              className="h-9 px-[18px] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] rounded-[8px] text-[13px] font-semibold hover:brightness-[1.08] transition-[filter] duration-[120ms]"
              onClick={() => { onApply(selected, view); onClose(); }}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
