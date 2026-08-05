import { useState, useMemo } from 'react';
import type { TabKey } from '@/lib/types';
import type { ExpandedState } from '@tanstack/react-table';
import { useReportingTableData } from '../../hooks/useReportingTableData';
import { adaptBackendData } from '../../utils/adapter';
import { useReportingStore } from '@/store/useReportingStore';

// Custom Hooks
import useCustomizeColumns from '../../hooks/useCustomizeColumns';
import useReportSelection from '../../hooks/useReportSelection';
import useReportDrilldown from '../../hooks/useReportDrilldown';
import useReportFilterSort from '../../hooks/useReportFilterSort';

// Sub-components
import { CustomiseColumnsModal } from './customize-columns/CustomiseColumnsModal';
import { ReportHeader } from './ReportHeader';
import { ReportTabs } from './ReportTabs';
import { ReportDrillBreadcrumb } from './ReportDrillBreadcrumb';
import { ReportSelectionBar } from './ReportSelectionBar';
import { ReportFilterBar } from './ReportFilterBar';
import { ReportTable } from './ReportTable';

export function AttributeReport() {
  const [tab, setTab] = useState<TabKey>('campaign');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { filter, setFilter, account } = useReportingStore();

  // 1. Backend Data Query & Adaptation
  const { tableData, tableDataLoading: loading } = useReportingTableData();

  const {
    visibleCols,
    activePreset,
    onApplyPreset,
    onApplyCustom,
    handleSavePreset,
    handleDeletePreset,
    customOpen,
    setCustomOpen,
    customizedColumnsData,
  } = useCustomizeColumns();

  const adaptedData = useMemo(() => {
    if (!tableData || !tableData.campaign) {
      return {
        campaign: [],
        adset: [],
        ad: [],
      };
    }
    return adaptBackendData(tableData);
  }, [tableData]);

  // 2. Drilldown state & breadcrumb navigation hook
  const { drill, drillTo, clearDrill } = useReportDrilldown({
    tab,
    setTab,
    onAfterDrill: () => setExpanded({}),
  });

  // 3. Search, Account Filter, Sorting & Row Count computation hook
  const { search, setSearch, sortKey, sortDir, setSort, rows, tabCounts } = useReportFilterSort({
    adaptedData,
    tab,
    drill,
    account,
  });

  // 4. Selection map & financial summary computation hook
  const {
    tabSelected,
    selIds,
    selSummary,
    allSelectedOnPage,
    someSelectedOnPage,
    toggleRow,
    toggleAll,
    clearSelection,
  } = useReportSelection({ rows, tab, adaptedData });

  // Handle drilldown trigger from selection bar
  const handleDrillTo = (target: TabKey) => {
    drillTo(target, selIds, adaptedData);
    clearSelection();
  };

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
        onDrillTo={handleDrillTo}
        onClearSelection={clearSelection}
      />

      {/* Filter/Search bar */}
      <ReportFilterBar
        tab={tab}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Main Table */}
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

      {/* Column Customization Modal */}
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
