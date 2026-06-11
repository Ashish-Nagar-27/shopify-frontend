import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ALL_COLUMNS, COL_BY_KEY, DEFAULT_VISIBLE } from '@/lib/data';
import * as Icon from '@/components/icons';

interface Props {
  open: boolean;
  initialSelected: string[];
  onClose: () => void;
  onApply: (keys: string[]) => void;
}

export function CustomiseColumnsModal({ open, initialSelected, onClose, onApply }: Props) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('all');
  const [view, setView]         = useState('myview');
  const [dragKey, setDragKey]   = useState<string | null>(null);

  useEffect(() => {
    if (open) { setSelected(initialSelected); setSearch(''); setTab('all'); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const defaultsKeys = new Set(DEFAULT_VISIBLE);
  const tabFiltered = ALL_COLUMNS.filter(c => {
    if (tab === 'defaults') return defaultsKeys.has(c.key);
    if (tab === 'custom')   return !defaultsKeys.has(c.key);
    return true;
  }).filter(c => !search || c.label.toLowerCase().includes(search.toLowerCase()));

  const toggle = (key: string) => {
    const col = COL_BY_KEY[key];
    if (col?.required) return;
    setSelected(s => s.includes(key) ? s.filter(k => k !== key) : [...s, key]);
  };

  const remove = (key: string) => {
    const col = COL_BY_KEY[key];
    if (col?.required) return;
    setSelected(s => s.filter(k => k !== key));
  };

  const onDragStart = (k: string) => setDragKey(k);
  const onDragOver  = (e: React.DragEvent) => e.preventDefault();
  const onDrop      = (target: string) => {
    if (!dragKey || dragKey === target) return;
    setSelected(s => {
      const next = [...s];
      const from = next.indexOf(dragKey), to = next.indexOf(target);
      if (from < 0 || to < 0) return s;
      next.splice(from, 1);
      next.splice(to, 0, dragKey);
      return next;
    });
    setDragKey(null);
  };

  const tabCls = (k: string) => cn(
    'px-3 py-[6px] bg-surface border border-border-soft rounded-[7px] text-[12px] text-fg-dim font-medium inline-flex items-center gap-1 transition-all duration-[120ms] hover:border-border',
    tab === k && 'bg-cyan-soft border-cyan-deep text-cyan',
  );

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
          <div className="px-4 py-[18px] border-r border-border-soft flex flex-col gap-[10px] bg-[oklch(0.115_0.018_240)]">
            <div className="text-[13px] font-semibold text-fg mb-3">
              Views <span className="text-fg-mute">(1)</span>
            </div>
            <div className="text-[11px] px-[10px] py-2 bg-surface border border-border-soft rounded-[7px] text-fg-mute">
              Current View: {view}
            </div>
            <button
              className={cn(
                'flex items-center justify-between px-3 py-[10px] border border-border-soft rounded-[8px] text-fg-dim text-[13px] text-left transition-all duration-[120ms] hover:text-fg hover:border-border',
                view === 'myview' && 'bg-cyan-soft border-cyan-deep text-cyan',
              )}
              onClick={() => setView('myview')}>
              <span>myview</span>
              <span title="Delete view">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>
                </svg>
              </span>
            </button>
            <button className="mt-auto flex items-center gap-2 px-3 py-[10px] bg-surface border border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21 12 17l-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Save as a column preset
            </button>
          </div>

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
                const checked = selected.includes(col.key);
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
          <div className="px-5 py-4 pr-0 flex flex-col gap-[10px] min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-fg">
                <b>{selected.length}</b> columns selected
              </span>
            </div>
            <div className="flex-1 overflow-y-auto border border-border-soft rounded-[9px] bg-bg-overlay p-[6px] flex flex-col gap-1 min-h-0">
              {selected.map(k => {
                const col = COL_BY_KEY[k];
                if (!col) return null;
                return (
                  <div
                    key={k}
                    className={cn(
                      'grid grid-cols-[18px_1fr_auto] gap-[10px] items-center px-[10px] py-[9px] bg-surface border border-border-soft rounded-[7px] text-[13px] text-fg cursor-grab transition-all duration-[120ms]',
                      col.required && 'bg-bg-overlay cursor-default',
                    )}
                    draggable={!col.required}
                    onDragStart={() => onDragStart(k)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(k)}
                    onDragEnd={() => setDragKey(null)}>
                    <span title="Drag to reorder" style={{ color: 'var(--fg-faint)', cursor: 'grab' }}>
                      <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                        <circle cx="2" cy="2" r="1"/><circle cx="8" cy="2" r="1"/>
                        <circle cx="2" cy="7" r="1"/><circle cx="8" cy="7" r="1"/>
                        <circle cx="2" cy="12" r="1"/><circle cx="8" cy="12" r="1"/>
                      </svg>
                    </span>
                    <span>{col.label}</span>
                    {col.required ? (
                      <span title="Required" style={{ color: 'var(--fg-faint)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="11" width="16" height="10" rx="2"/>
                          <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                        </svg>
                      </span>
                    ) : (
                      <button
                        className="w-[22px] h-[22px] grid place-items-center rounded-[5px] text-fg-mute hover:bg-neg-soft hover:text-neg transition-[background,color] duration-[120ms]"
                        onClick={(e) => { e.stopPropagation(); remove(k); }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="m6 6 12 12M6 18 18 6"/>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
              onClick={() => { onApply(selected); onClose(); }}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
