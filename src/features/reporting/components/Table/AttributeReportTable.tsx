import { useState, useMemo, useEffect } from 'react';
import { COLUMN_PRESETS, derived, COL_BY_KEY, mapPresetViewName } from '@/lib/data';
import type { CampaignRow, TabKey, DrillState, ColumnDef } from '@/lib/types';
import { CustomiseColumnsModal } from './CustomiseColumnsModal';
import type { ExpandedState } from '@tanstack/react-table';
import { useReportingTableData } from '../../hooks/useReportingTableData';
import { adaptBackendData } from '../../utils/adapter';
import { useAuthStore } from "@/store/useAuthStore";
// Import sub-components
import { ReportHeader } from './ReportHeader';
import { ReportTabs } from './ReportTabs';
import { ReportDrillBreadcrumb } from './ReportDrillBreadcrumb';
import { ReportSelectionBar } from './ReportSelectionBar';
import { ReportFilterBar } from './ReportFilterBar';
import { ReportTable } from './ReportTable';
import { useReportingStore } from '@/store/useReportingStore';

export function AttributeReport() {
  const [tab, setTab] = useState<TabKey>('campaign');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('Spend');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [visibleCols, setVisibleCols] = useState<ColumnDef[]>(COLUMN_PRESETS['Default']);
  const [customOpen, setCustomOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');
  const [hasInitializedCols, setHasInitializedCols] = useState(false);

  const { filter, setFilter } = useReportingStore();

  const [selected, setSelected] = useState<Record<string, Record<string, boolean>>>({});
  const [drill, setDrill] = useState<DrillState | null>(null);
  const {  account } = useReportingStore();
  const { user } = useAuthStore();
  console.log('user ', user)
  console.log('visibleCols ', visibleCols)



  const tabSelected = selected[tab] || {};
  const selIds = Object.keys(tabSelected).filter((k) => tabSelected[k]);

  // Query actual backend data based on attribution options
  const { tableData, tableDataLoading, customizedColumnsData, updateColumnsMutation, deleteColumnsMutation } = useReportingTableData();
  console.log('customizedColumnsData ', customizedColumnsData)
  // Load default customized columns from backend once available
  useEffect(() => {
    if (customizedColumnsData?.data && !hasInitializedCols) {
      let cols = [...customizedColumnsData.data]
        .sort((a, b) => a.seq - b.seq)
        .map(item => COL_BY_KEY[item.field])
        .filter(Boolean) as ColumnDef[];

      // Filter out name and status completely
      cols = cols.filter(c => c.key !== 'name' && c.key !== 'status');

      if (cols.length > 0) {
        setVisibleCols(cols);
        const match = Object.entries(COLUMN_PRESETS).find(
          ([, k]) => {
            const pk = k.filter(c => c.key !== 'name' && c.key !== 'status');
            return pk.length === cols.length && pk.every((v, i) => v.key === cols[i].key);
          }
        );
        setActivePreset(match ? match[0] : 'Custom');
        setHasInitializedCols(true);
      }
    }
  }, [customizedColumnsData, hasInitializedCols]);

  // Adapt backend data with local mock fallback
  const adaptedData = useMemo(() => {
    console.log('accounttts ', account)
    if (!tableData || !tableData.campaign) {
      return {
        "campaign": [],
        "adset": [],
        "ad": []
      };
    }

    return adaptBackendData(tableData);
  }, [tableData]);


  // Client-side filtering, searching, and sorting on adapted data
  const rows = useMemo<CampaignRow[]>(() => {
    let result = [...(adaptedData[tab] || [])];

    // 1. Filter by drilldown state
    if (drill && drill.targetTab === tab) {
      const idSet = new Set(drill.ids);
      if (drill.fromTab === 'campaign' && tab === 'adset') {
        result = result.filter((r) => idSet.has(r.parentId || ''));
      } else if (drill.fromTab === 'adset' && tab === 'ad') {
        result = result.filter((r) => idSet.has(r.parentId || ''));
      } else if (drill.fromTab === 'campaign' && tab === 'ad') {
        result = result.filter((r) => idSet.has(r.campaignId || ''));
      }
    }

    // 2. Filter by account
    if (account && account !== 'All') {
      result = result.filter((r) => r.account === account);
    }

    // 3. Filter by search query
    if (search) {
      const query = search.toLowerCase();
      result = result.filter((r) =>
        (r.name + ' ' + (r.sub || '')).toLowerCase().includes(query)
      );
    }

    // 4. Sort rows
    if (sortKey) {
      const dir = sortDir || 'desc';
      result.sort((a, b) => {
        const av = derived(a, sortKey) || 0;
        const bv = derived(b, sortKey) || 0;
        return dir === 'asc' ? av - bv : bv - av;
      });
    }

    return result;
  }, [adaptedData, tab, search, sortKey, sortDir, drill, account]);

  const loading = tableDataLoading;

  const setSort = (k: string) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(k);
      setSortDir('desc');
    }
  };

  const onApplyPreset = (name: string) => {
    setActivePreset(name);
    const presetCols = COLUMN_PRESETS[name].filter(c => c.key !== 'name' && c.key !== 'status');
    setVisibleCols(presetCols);
    const updatecols = presetCols?.map((col, index) => ({ field: col.key, seq: index + 1, workspace: user?.id }))
    updateColumnsMutation.mutate({ updatecols, viewName: mapPresetViewName(name) });
  };
  const onApplyCustom = (cols: ColumnDef[], viewName?: string) => {
    const cleanCols = cols.filter(c => c.key !== 'name' && c.key !== 'status');

    setVisibleCols(cleanCols);
    const updatecols = cleanCols?.map((col, index) => ({ field: col.key, seq: index + 1, workspace: user?.id }))
    const match = Object.entries(COLUMN_PRESETS).find(
      ([, k]) => {
        const pk = k.filter(c => c.key !== 'name' && c.key !== 'status');
        return pk.length === cleanCols.length && pk.every((v, i) => v.key === cleanCols[i].key);
      }
    );
    const presetName = match ? match[0] : 'Custom';
    setActivePreset(presetName);

    updateColumnsMutation.mutate({ updatecols, viewName: viewName || "myview" });
  };

  const handleSavePreset = (presetName: string, selectedCols: ColumnDef[]) => {
    const cleanCols = selectedCols.filter(c => c.key !== 'name' && c.key !== 'status');

    const updatecols = cleanCols.map((col, index) => ({
      field: col.key,
      seq: index + 1,
      workspace: user?.id,
    }));

    updateColumnsMutation.mutate(
      { updatecols, viewName: presetName },
      {
        onSuccess: () => {
          setVisibleCols(cleanCols);
          setActivePreset(presetName);
        },
      }
    );
  };
  const handleDeletePreset = (presetName: string) => {
    deleteColumnsMutation.mutate(presetName, {
      onSuccess: () => {
        if (activePreset === presetName) {
          setActivePreset('Default');
          setVisibleCols(COLUMN_PRESETS['Default']);
        }
      },
    });
  };
  // Compute tab counts based on current filters and data
  const tabCounts = useMemo<Record<TabKey, number>>(() => {
    const getBaseRows = (t: TabKey) => {
      let r = adaptedData[t] || [];
      if (drill && drill.targetTab === t) {
        const idSet = new Set(drill.ids);
        if (drill.fromTab === 'campaign' && t === 'adset') r = r.filter((x) => idSet.has(x.parentId || ''));
        else if (drill.fromTab === 'adset' && t === 'ad') r = r.filter((x) => idSet.has(x.parentId || ''));
        else if (drill.fromTab === 'campaign' && t === 'ad') r = r.filter((x) => idSet.has(x.campaignId || ''));
      }
      if (account && account !== 'All') {
        r = r.filter((x) => x.account === account);
      }
      return r;
    };
    return {
      campaign: getBaseRows('campaign').length,
      adset: getBaseRows('adset').length,
      ad: getBaseRows('ad').length,
    };
  }, [drill, adaptedData, account]);

  const isCheckable = tab === 'campaign' || tab === 'adset';
  const allSelectedOnPage = isCheckable && rows.length > 0 && rows.every((r) => tabSelected[r.id]);
  const someSelectedOnPage = isCheckable && rows.some((r) => tabSelected[r.id]);

  const toggleRow = (id: string) =>
    setSelected((s) => {
      const cur = { ...(s[tab] || {}) };
      if (cur[id]) delete cur[id];
      else cur[id] = true;
      return { ...s, [tab]: cur };
    });
  const toggleAll = () =>
    setSelected((s) => {
      const cur = { ...(s[tab] || {}) };
      if (allSelectedOnPage) rows.forEach((r) => delete cur[r.id]);
      else
        rows.forEach((r) => {
          cur[r.id] = true;
        });
      return { ...s, [tab]: cur };
    });
  const clearSelection = () => setSelected((s) => ({ ...s, [tab]: {} }));

  const drillTo = (target: TabKey) => {
    if (!selIds.length) return;
    const rowsById = Object.fromEntries((adaptedData[tab] || []).map((r) => [r.id, r]));
    const labels = selIds.map((id) => rowsById[id]?.name).filter(Boolean) as string[];
    setDrill({ fromTab: tab, targetTab: target, ids: selIds, labels });
    setTab(target);
    clearSelection();
    setExpanded({});
  };
  const clearDrill = () => setDrill(null);

  useEffect(() => {
    if (drill && drill.targetTab !== tab) setDrill(null);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const selSummary = useMemo(() => {
    if (!selIds.length) return null;
    let spend = 0,
      rev = 0,
      sales = 0;
    selIds.forEach((id) => {
      const r = (adaptedData[tab] || []).find((x) => x.id === id);
      if (r) {
        spend += r.spend || 0;
        rev += r.rev || 0;
        sales += r.sales || 0;
      }
    });
    return { spend, rev, sales };
  }, [selIds.join(','), tab, adaptedData]); // eslint-disable-line react-hooks/exhaustive-deps
 

  return (
    <div className="bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)]">
      {/* Card header */}
      <ReportHeader
        filter={filter}
        onFilterChange={setFilter}
        activePreset={activePreset}
        onApplyPreset={onApplyPreset}
        onCustomise={() => setCustomOpen(true)}
        rows={rows}
        tab={tab}
        adaptedData={adaptedData}
        visibleCols={visibleCols}
      />

      {/* Tabs */}
      <ReportTabs
        tab={tab}
        onTabChange={setTab}
        tabCounts={tabCounts}
        rowsCount={rows.length}
      />

      {/* Drill breadcrumb */}
      <ReportDrillBreadcrumb
        drill={drill}
        tab={tab}
        onClearDrill={clearDrill}
      />

      {/* Selection bar */}
      <ReportSelectionBar
        tab={tab}
        selIds={selIds}
        selSummary={selSummary}
        onDrillTo={drillTo}
        onClearSelection={clearSelection}
      />

      {/* Filter/Search bar */}
      <ReportFilterBar
        tab={tab}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Table */}
      <ReportTable
        rows={rows}
        loading={loading}
        visibleCols={visibleCols}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={setSort}
        expanded={expanded}
        onExpandedChange={setExpanded}
        tab={tab}
        tabSelected={tabSelected}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        allSelectedOnPage={allSelectedOnPage}
        someSelectedOnPage={someSelectedOnPage}
        filter={filter}
      />



      <CustomiseColumnsModal
        open={customOpen}
        initialSelected={visibleCols}
        onClose={() => setCustomOpen(false)}
        onApply={onApplyCustom}
        views={customizedColumnsData?.views || []}
        currentView={customizedColumnsData?.current_view || null}
        onSavePreset={handleSavePreset}
        onDeletePreset={handleDeletePreset}
      />

    </div>
  );
}
