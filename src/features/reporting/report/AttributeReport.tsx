import { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  DATA, ALL_COLUMNS, COL_BY_KEY, DEFAULT_VISIBLE,
  COLUMN_PRESETS, FILTER_OPTIONS, FILTER_DEFAULTS, derived,
} from '@/lib/data';
import { fmt, fmtMoney } from '@/lib/utils';
import type { CampaignRow, FilterState } from '@/lib/types';
import { SrcIcon } from './SrcIcon';
import { StatusBadge } from './StatusBadge';
import { ColumnsMenu } from './ColumnsMenu';
import { CustomiseColumnsModal } from './CustomiseColumnsModal';
import { FilterPopover } from './FilterPopover';
import * as Icon from '@/components/icons';

const TAB_DEFS = [
  { key: 'campaign', label: 'Campaign', icon: <Icon.campaign width="14" height="14" /> },
  { key: 'adset',    label: 'Ad set',   icon: <Icon.adset    width="14" height="14" /> },
  { key: 'ad',       label: 'Ad',       icon: <Icon.ad       width="14" height="14" /> },
];
type TabKey = 'campaign' | 'adset' | 'ad';

/* Shared button styles */
const ctrlBase = 'inline-flex items-center gap-2 h-9 px-3 bg-surface border border-border-soft rounded-[10px] text-fg-dim text-[13px] transition-[border-color,color,background] duration-150 hover:border-border hover:text-fg';

function renderCell(
  row: CampaignRow, key: string, depth: number,
  expanded: boolean, onToggle: (() => void) | null, hasChildren: boolean,
): React.ReactNode {
  if (key === 'name') {
    return (
      <div className="inline-flex items-center gap-[10px] max-w-[360px]">
        {hasChildren ? (
          <button
            className={cn(
              'w-5 h-5 rounded-[5px] grid place-items-center text-fg-mute flex-shrink-0 transition-[transform,color,background] duration-150 hover:text-fg hover:bg-surface-2',
              expanded && 'rotate-90 text-cyan',
            )}
            onClick={onToggle ?? undefined}
            title={expanded ? 'Collapse' : 'Expand'}>
            <Icon.chevron width="12" height="12" />
          </button>
        ) : <span style={{ width: 20, flexShrink: 0 }} />}
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
  switch (key) {
    case 'spend':        return fmtMoney(v);
    case 'rev':          return '₹' + fmt(v);
    case 'sales':        return fmt(v);
    case 'reportedSale': return <span className="text-cyan underline decoration-dotted underline-offset-[3px] cursor-pointer">{fmt(v)}</span>;
    case 'roas':         return <span className={v >= 1 ? 'text-pos' : v > 0 ? '' : 'text-fg-mute'}>{v.toFixed(2)}×</span>;
    case 'cpa':          return fmtMoney(v);
    case 'aov':          return '₹' + fmtMoney(v);
    case 'cpm':          return fmtMoney(v);
    case 'cpc':          return fmtMoney(v);
    case 'cpl':          return fmtMoney(v);
    case 'ctr':          return v.toFixed(2) + '%';
    case 'frequency':    return v.toFixed(1);
    case 'marginPct':    return v + '%';
    case 'trafficScore': return <span className={v >= 70 ? 'text-pos' : v >= 50 ? '' : 'text-fg-mute'}>{v}</span>;
    default:             return fmt(v);
  }
}

function renderTotal(key: string, rawRows: CampaignRow[]): React.ReactNode {
  if (key === 'name')   return null;
  if (key === 'status') return <span className="text-fg-mute">—</span>;
  const sumKeys = ['spend','rev','sales','reportedSale','impressions','clicks','reach','videoViews','videoP25','videoP50','videoP75','videoP100','atc','checkout','newCust','returningCust','leads'];
  const avgKeys = ['roas','cpa','aov','cpm','cpc','cpl','ctr','frequency','marginPct','ltv','trafficScore'];
  if (sumKeys.includes(key)) {
    let sum = 0;
    rawRows.forEach(r => { sum += derived(r, key) || 0; });
    if (key === 'rev') return '₹' + fmt(sum);
    return fmt(sum);
  }
  if (avgKeys.includes(key)) {
    let weighted = 0, count = 0;
    rawRows.forEach(r => { weighted += derived(r, key) || 0; count++; });
    const v = count ? weighted / count : 0;
    if (key === 'ctr') return v.toFixed(2) + '%';
    if (key === 'roas') return v.toFixed(2) + '×';
    if (key === 'frequency') return v.toFixed(1);
    if (key === 'marginPct') return Math.round(v) + '%';
    if (key === 'aov' || key === 'ltv') return '₹' + fmtMoney(v);
    return fmtMoney(v);
  }
  return <span className="text-fg-mute">—</span>;
}

interface DrillState { fromTab: TabKey; targetTab: TabKey; ids: string[]; labels: string[]; }

export function AttributeReport() {
  const [tab, setTab]         = useState<TabKey>('campaign');
  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState('spend');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ c1: true });

  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE);
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const [customOpen, setCustomOpen]     = useState(false);
  const [activePreset, setActivePreset] = useState('Default');
  const colsBtnRef = useRef<HTMLButtonElement>(null);

  const [filter, setFilter]   = useState<FilterState>(FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterCount = Object.keys(FILTER_DEFAULTS).filter(
    k => filter[k as keyof FilterState] !== FILTER_DEFAULTS[k as keyof FilterState],
  ).length;

  const [selected, setSelected] = useState<Record<string, Record<string, boolean>>>({});
  const [drill, setDrill]       = useState<DrillState | null>(null);

  const tabSelected = selected[tab] || {};
  const selIds = Object.keys(tabSelected).filter(k => tabSelected[k]);

  const baseRows = useMemo(() => {
    let rows = DATA[tab];
    if (drill && drill.targetTab === tab) {
      const idSet = new Set(drill.ids);
      if (drill.fromTab === 'campaign' && tab === 'adset')      rows = rows.filter(r => idSet.has(r.parentId || ''));
      else if (drill.fromTab === 'adset' && tab === 'ad')        rows = rows.filter(r => idSet.has(r.parentId || ''));
      else if (drill.fromTab === 'campaign' && tab === 'ad')     rows = rows.filter(r => idSet.has(r.campaignId || ''));
    }
    return rows;
  }, [tab, drill]);

  const rows = useMemo(() => {
    const filtered = search
      ? baseRows.filter(r => (r.name + ' ' + (r.sub || '')).toLowerCase().includes(search.toLowerCase()))
      : baseRows;
    return [...filtered].sort((a, b) => {
      const av = derived(a, sortKey) || 0, bv = derived(b, sortKey) || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [baseRows, search, sortKey, sortDir]);

  const setSort = (k: string) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const onApplyPreset = (name: string) => { setActivePreset(name); setVisibleCols(COLUMN_PRESETS[name]); };
  const onApplyCustom = (keys: string[]) => {
    setVisibleCols(keys);
    const match = Object.entries(COLUMN_PRESETS).find(([, k]) => k.length === keys.length && k.every((v, i) => v === keys[i]));
    setActivePreset(match ? match[0] : 'Custom');
  };

  const tabCounts: Record<TabKey, number> = {
    campaign: DATA.campaign.length,
    adset:    drill && drill.targetTab === 'adset' ? baseRows.length : DATA.adset.length,
    ad:       drill && drill.targetTab === 'ad'    ? baseRows.length : DATA.ad.length,
  };

  const isCheckable = tab === 'campaign' || tab === 'adset';
  const allSelectedOnPage = isCheckable && rows.length > 0 && rows.every(r => tabSelected[r.id]);
  const someSelectedOnPage = isCheckable && rows.some(r => tabSelected[r.id]);

  const toggleRow = (id: string) => setSelected(s => {
    const cur = { ...(s[tab] || {}) };
    if (cur[id]) delete cur[id]; else cur[id] = true;
    return { ...s, [tab]: cur };
  });
  const toggleAll = () => setSelected(s => {
    const cur = { ...(s[tab] || {}) };
    if (allSelectedOnPage) rows.forEach(r => delete cur[r.id]);
    else rows.forEach(r => { cur[r.id] = true; });
    return { ...s, [tab]: cur };
  });
  const clearSelection = () => setSelected(s => ({ ...s, [tab]: {} }));

  const drillTo = (target: TabKey) => {
    if (!selIds.length) return;
    const rowsById = Object.fromEntries(DATA[tab].map(r => [r.id, r]));
    const labels = selIds.map(id => rowsById[id]?.name).filter(Boolean) as string[];
    setDrill({ fromTab: tab, targetTab: target, ids: selIds, labels });
    setTab(target); clearSelection(); setExpanded({});
  };
  const clearDrill = () => setDrill(null);

  useEffect(() => {
    if (drill && drill.targetTab !== tab) setDrill(null);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const selSummary = useMemo(() => {
    if (!selIds.length) return null;
    let spend = 0, rev = 0, sales = 0;
    selIds.forEach(id => {
      const r = DATA[tab].find(x => x.id === id);
      if (r) { spend += r.spend || 0; rev += r.rev || 0; sales += r.sales || 0; }
    });
    return { spend, rev, sales };
  }, [selIds.join(','), tab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Shared td class builder ── */
  const tdCls = (key: string, rowState?: 'hover' | 'expanded' | 'child') => cn(
    'border-b border-border-soft whitespace-nowrap',
    key === 'name' ? 'text-left pl-5 font-sans' : 'text-right px-[14px] font-mono tabular-nums text-fg',
    COL_BY_KEY[key]?.align === 'center' && 'text-center',
    rowState === 'expanded' && 'bg-bg-row-expand',
    rowState === 'child'    && 'bg-bg-row-child text-[12px]',
  );

  return (
    <div className="bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)]">

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
        <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase text-fg-mute m-0">
          Attribute Report · <span className="text-cyan">All Sources</span>
        </h3>
        <div className="inline-flex gap-2 items-center">
          <div style={{ position: 'relative' }}>
            <button
              ref={filterBtnRef}
              className={cn(ctrlBase, filterOpen && 'border-cyan-deep text-cyan')}
              onClick={() => setFilterOpen(o => !o)}>
              <Icon.filter width="14" height="14" /> Filter
              {filterCount > 0 && (
                <span style={{ color: 'var(--cyan)', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700 }}>
                  {filterCount}
                </span>
              )}
            </button>
            <FilterPopover
              open={filterOpen} anchorRef={filterBtnRef}
              onClose={() => setFilterOpen(false)}
              value={filter} onApply={setFilter} />
          </div>
          <div style={{ position: 'relative' }}>
            <button
              ref={colsBtnRef}
              className={cn(ctrlBase, colsMenuOpen && 'border-cyan-deep text-cyan')}
              onClick={() => setColsMenuOpen(o => !o)}>
              <Icon.columns width="14" height="14" /> Columns
            </button>
            <ColumnsMenu
              open={colsMenuOpen} anchorRef={colsBtnRef}
              onClose={() => setColsMenuOpen(false)}
              currentPreset={activePreset}
              onApplyPreset={onApplyPreset}
              onCustomise={() => setCustomOpen(true)} />
          </div>
          <button className={cn(ctrlBase, 'w-9 px-0 justify-center')} title="Export">
            <Icon.download width="14" height="14" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-stretch px-5 border-b border-border-soft">
        {TAB_DEFS.map(t => (
          <div
            key={t.key}
            className={cn(
              'relative inline-flex items-center gap-[10px] px-5 py-4 pb-[14px] text-[13px] font-medium cursor-pointer transition-[color] duration-150 border-b-2 border-transparent mb-[-1px]',
              tab === t.key ? 'text-fg border-b-cyan' : 'text-fg-mute hover:text-fg-dim',
            )}
            onClick={() => setTab(t.key as TabKey)}>
            <span className="w-[14px] h-[14px] opacity-90">{t.icon}</span>
            {t.label}
            <span className={cn(
              'text-[10px] font-mono font-semibold px-[6px] py-[2px] rounded-[4px]',
              tab === t.key ? 'text-cyan bg-cyan-soft' : 'bg-surface-2 text-fg-mute',
            )}>
              {tabCounts[t.key as TabKey]}
            </span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div className="inline-flex items-center px-5 text-fg-faint cursor-default">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em' }}>
            Showing {rows.length} of {tabCounts[tab]}
          </span>
        </div>
      </div>

      {/* Drill breadcrumb */}
      {drill && drill.targetTab === tab && (
        <div className="flex items-center flex-wrap gap-2 px-5 py-[10px] bg-bg-overlay border-b border-border-soft text-[12px]">
          <span className="text-fg-mute font-medium text-[11px] tracking-[0.08em] uppercase">
            Filtered from {drill.fromTab === 'campaign' ? 'Campaign' : 'Ad set'}:
          </span>
          {drill.labels.slice(0, 3).map((l, i) => (
            <span key={i} className="inline-flex items-center px-[10px] py-1 bg-cyan-soft text-cyan rounded-full text-[12px] font-medium">{l}</span>
          ))}
          {drill.labels.length > 3 && (
            <span className="inline-flex items-center px-[10px] py-1 bg-cyan-soft text-cyan rounded-full text-[12px] font-medium">
              +{drill.labels.length - 3} more
            </span>
          )}
          <button
            className="inline-flex items-center gap-[5px] px-[10px] py-1 ml-auto bg-transparent border border-border-soft rounded-full text-fg-mute text-[12px] hover:text-fg hover:border-border transition-[color,border-color] duration-[120ms]"
            onClick={clearDrill} title="Clear filter">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M6 18 18 6"/>
            </svg>
            Show all
          </button>
        </div>
      )}

      {/* Selection bar */}
      {selIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[linear-gradient(90deg,var(--cyan-soft),oklch(0.72_0.20_340/0.08))] border-b border-[oklch(0.82_0.14_200/0.30)] border-t border-t-[oklch(0.82_0.14_200/0.20)] [animation:sel-in_0.15s_ease]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-[6px] text-[13px] text-fg font-medium">
              <span className="inline-grid place-items-center min-w-6 h-[22px] px-[6px] bg-cyan text-[oklch(0.10_0.018_240)] rounded-[6px] font-mono font-bold text-[12px]">
                {selIds.length}
              </span>
              {tab === 'campaign' ? ' campaign' : ' ad set'}{selIds.length > 1 ? 's' : ''} selected
            </span>
            {selSummary && (
              <span className="inline-flex items-center gap-[10px] text-[12px] text-fg-dim pl-4 border-l border-[oklch(0.82_0.14_200/0.25)]">
                <span><span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Spend</span> <b className="text-fg font-mono font-bold">₹{selSummary.spend.toLocaleString()}</b></span>
                <span className="text-fg-faint">·</span>
                <span><span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Rev</span> <b className="text-fg font-mono font-bold">₹{selSummary.rev.toLocaleString()}</b></span>
                <span className="text-fg-faint">·</span>
                <span><span className="text-[10px] text-fg-mute tracking-[0.10em] uppercase font-semibold mr-1">Orders</span> <b className="text-fg font-mono font-bold">{selSummary.sales}</b></span>
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-2">
            {tab === 'campaign' && (
              <>
                <button className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan" onClick={() => drillTo('adset')}>
                  <Icon.adset width="13" height="13" /> View Ad sets <Icon.chevron width="11" height="11" />
                </button>
                <button className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan" onClick={() => drillTo('ad')}>
                  <Icon.ad width="13" height="13" /> View Ads <Icon.chevron width="11" height="11" />
                </button>
              </>
            )}
            {tab === 'adset' && (
              <button className="inline-flex items-center gap-[6px] h-8 px-3 bg-surface border border-[oklch(0.82_0.14_200/0.30)] rounded-[7px] text-fg text-[12px] font-semibold transition-all duration-[120ms] hover:bg-cyan hover:text-[oklch(0.10_0.018_240)] hover:border-cyan" onClick={() => drillTo('ad')}>
                <Icon.ad width="13" height="13" /> View Ads <Icon.chevron width="11" height="11" />
              </button>
            )}
            <button
              className="inline-flex items-center gap-[6px] h-8 px-3 bg-transparent border border-border-soft rounded-[7px] text-fg-mute font-normal text-[12px] transition-all duration-[120ms] hover:text-neg hover:border-neg"
              onClick={clearSelection}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M6 18 18 6"/></svg>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-5 py-[14px] flex-wrap">
        <div className="inline-flex items-center gap-2 flex-1 min-w-[200px] max-w-[360px] h-9 px-3 bg-bg-deep border border-border-soft rounded-[9px]">
          <Icon.search width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
          <input
            className="flex-1 border-none outline-none bg-transparent text-[13px] text-fg placeholder:text-fg-faint"
            placeholder={`Search ${tab === 'campaign' ? 'campaigns' : tab === 'adset' ? 'ad sets' : 'ads'}…`}
            value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="inline-flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-fg-mute uppercase tracking-[0.08em] font-semibold">Account</span>
          <button className="inline-flex items-center gap-2 h-9 px-[10px] pl-3 bg-bg-deep border border-border-soft rounded-[9px] text-[13px] text-fg min-w-[110px] hover:border-border transition-[border-color] duration-[120ms]">
            <span>All accounts</span>
            <Icon.chevronDown className="text-fg-mute ml-auto" width="12" height="12" />
          </button>
          <span className="text-[11px] text-fg-mute uppercase tracking-[0.08em] font-semibold ml-2">Source</span>
          <button className="inline-flex items-center gap-2 h-9 px-[10px] pl-3 bg-bg-deep border border-border-soft rounded-[9px] text-[13px] text-fg min-w-[110px] hover:border-border transition-[border-color] duration-[120ms]">
            <span className="w-[14px] h-[14px] rounded-[3px] bg-[linear-gradient(135deg,#1877F2,#0a4fb0)] flex-shrink-0" />
            <span>Facebook</span>
            <Icon.chevronDown className="text-fg-mute ml-auto" width="12" height="12" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {isCheckable && (
                <th className="sticky top-0 bg-bg-panel w-[44px] pl-5 text-left border-b border-border-soft">
                  <span
                    style={{
                      display: 'inline-grid', placeItems: 'center',
                      width: 18, height: 18, borderRadius: 5,
                      border: `1.5px solid ${allSelectedOnPage ? 'var(--cyan)' : 'var(--border)'}`,
                      background: allSelectedOnPage ? 'var(--cyan)' : 'transparent',
                      cursor: 'pointer', color: 'oklch(0.10 0.018 240)',
                    }}
                    onClick={toggleAll} role="checkbox" aria-checked={allSelectedOnPage}>
                    {allSelectedOnPage && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5 9-11"/>
                      </svg>
                    )}
                    {!allSelectedOnPage && someSelectedOnPage && (
                      <span style={{ width: 8, height: 2, background: 'var(--cyan)', borderRadius: 1 }} />
                    )}
                  </span>
                </th>
              )}
              {visibleCols.map(key => {
                const c = COL_BY_KEY[key];
                if (!c) return null;
                return (
                  <th
                    key={c.key}
                    className={cn(
                      'sticky top-0 bg-bg-panel text-[10px] font-semibold tracking-[0.12em] uppercase text-fg-mute px-[14px] py-3 border-b border-border-soft whitespace-nowrap font-sans',
                      c.align === 'center' ? 'text-center' : 'text-right',
                      c.key === 'name' && 'text-left pl-5',
                      (c.num || c.sortable) && 'cursor-pointer select-none hover:text-fg',
                    )}
                    style={{ minWidth: c.width }}
                    onClick={() => (c.num || c.sortable) && setSort(c.key)}>
                    {c.label}
                    {c.info && <span style={{ marginLeft: 4, color: 'var(--fg-faint)' }}>ⓘ</span>}
                    {sortKey === c.key && (
                      <span className="text-cyan ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <>
                <tr key={row.id} className="group">
                  {isCheckable && (
                    <td className="border-b border-border-soft pl-5 group-hover:bg-bg-row-hover" style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}>
                      <span
                        style={{
                          display: 'inline-grid', placeItems: 'center',
                          width: 18, height: 18, borderRadius: 5,
                          border: `1.5px solid ${tabSelected[row.id] ? 'var(--cyan)' : 'var(--border)'}`,
                          background: tabSelected[row.id] ? 'var(--cyan)' : 'transparent',
                          cursor: 'pointer', color: 'oklch(0.10 0.018 240)',
                        }}
                        onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}
                        role="checkbox" aria-checked={!!tabSelected[row.id]}>
                        {tabSelected[row.id] && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12 5 5 9-11"/>
                          </svg>
                        )}
                      </span>
                    </td>
                  )}
                  {visibleCols.map(key => (
                    <td
                      key={key}
                      className={cn(tdCls(key, expanded[row.id] ? 'expanded' : undefined), 'group-hover:bg-bg-row-hover')}
                      style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}>
                      {renderCell(row, key, 0, !!expanded[row.id],
                        () => setExpanded(e => ({ ...e, [row.id]: !e[row.id] })),
                        !!(row.children && row.children.length))}
                    </td>
                  ))}
                </tr>
                {expanded[row.id] && row.children && row.children.map(ch => (
                  <tr key={ch.id}>
                    {isCheckable && <td className="border-b border-border-soft bg-bg-row-child" />}
                    {visibleCols.map((key, ci) => (
                      <td
                        key={key}
                        className={cn(tdCls(key, 'child'), ci === 0 && 'pl-[50px]')}
                        style={{ paddingTop: 'var(--row-pad)', paddingBottom: 'var(--row-pad)' }}>
                        {renderCell(ch, key, 1, false, null, false)}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {isCheckable && <td className="px-[14px] py-[14px] bg-bg-footer border-t border-border font-mono tabular-nums text-right font-semibold text-fg text-[13px]" />}
              {visibleCols.map((key, i) => (
                <td
                  key={key}
                  className={cn(
                    'px-[14px] py-[14px] bg-bg-footer border-t border-border font-mono tabular-nums text-right font-semibold text-fg text-[13px]',
                    COL_BY_KEY[key]?.align === 'center' && 'text-center',
                    i === 0 && 'text-left pl-5 font-sans uppercase text-[11px] tracking-[0.12em] text-fg-mute',
                  )}>
                  {i === 0
                    ? `Totals · ${rows.length} ${tab === 'campaign' ? 'campaigns' : tab === 'adset' ? 'ad sets' : 'ads'}`
                    : renderTotal(key, rows)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Table footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft text-[12px] text-fg-mute">
        <span>
          Last refreshed <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--mono)' }}>2 min ago</span>
          {' · '}Click <span style={{ color: 'var(--cyan)' }}>{FILTER_OPTIONS.clickHandling.find(o => o.value === filter.clickHandling)?.label}</span>
          {' · '}Window <span style={{ color: 'var(--cyan)' }}>{FILTER_OPTIONS.window.find(o => o.value === filter.window)?.label}</span>
          {' · '}Model <span style={{ color: 'var(--cyan)' }}>{FILTER_OPTIONS.model.find(o => o.value === filter.model)?.label}</span>
        </span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-[6px] grid place-items-center text-fg-mute text-[12px] font-mono hover:text-fg hover:bg-surface-2 transition-[color,background] duration-[120ms]" title="Prev">
            <Icon.chevron width="12" height="12" style={{ transform: 'rotate(180deg)' }} />
          </button>
          {[1, 2, 3].map(p => (
            <button key={p} className={cn(
              'w-7 h-7 rounded-[6px] grid place-items-center text-[12px] font-mono transition-[color,background] duration-[120ms] hover:text-fg hover:bg-surface-2',
              p === 1 ? 'text-cyan bg-cyan-soft' : 'text-fg-mute',
            )}>
              {p}
            </button>
          ))}
          <button className="w-7 h-7 rounded-[6px] grid place-items-center text-fg-mute text-[12px] font-mono hover:text-fg hover:bg-surface-2 transition-[color,background] duration-[120ms]" title="Next">
            <Icon.chevron width="12" height="12" />
          </button>
        </div>
      </div>

      <CustomiseColumnsModal
        open={customOpen}
        initialSelected={visibleCols}
        onClose={() => setCustomOpen(false)}
        onApply={onApplyCustom} />
    </div>
  );
}
