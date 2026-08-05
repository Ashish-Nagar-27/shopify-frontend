import { useState, useMemo, useCallback } from 'react';
import type { CampaignRow, TabKey } from '@/lib/types';

interface UseReportSelectionProps {
  rows: CampaignRow[];
  tab: TabKey;
  adaptedData?: Record<TabKey, CampaignRow[]>;
}

export function useReportSelection({ rows = [], tab, adaptedData }: UseReportSelectionProps) {
  // State storing selection mapping: { campaign: { [id]: boolean }, adset: { [id]: boolean } }
  const [selected, setSelected] = useState<Record<string, Record<string, boolean>>>({});

  // Selection map for the active tab
  const tabSelected = useMemo(() => selected[tab] || {}, [selected, tab]);

  // Selected Row IDs for the active tab
  const selIds = useMemo(
    () => Object.keys(tabSelected).filter((k) => tabSelected[k]),
    [tabSelected]
  );

  // Checkbox capability check
  const isCheckable = tab === 'campaign' || tab === 'adset';

  // Header checkbox states
  const allSelectedOnPage = useMemo(
    () => isCheckable && rows.length > 0 && rows.every((r) => tabSelected[r.id]),
    [isCheckable, rows, tabSelected]
  );

  const someSelectedOnPage = useMemo(
    () => isCheckable && rows.some((r) => tabSelected[r.id]),
    [isCheckable, rows, tabSelected]
  );

  // Toggle single row checkbox
  const toggleRow = useCallback(
    (id: string) => {
      setSelected((s) => {
        const cur = { ...(s[tab] || {}) };
        if (cur[id]) {
          delete cur[id];
        } else {
          cur[id] = true;
        }
        return { ...s, [tab]: cur };
      });
    },
    [tab]
  );

  // Toggle select-all on current visible page
  const toggleAll = useCallback(() => {
    setSelected((s) => {
      const cur = { ...(s[tab] || {}) };
      if (allSelectedOnPage) {
        rows.forEach((r) => delete cur[r.id]);
      } else {
        rows.forEach((r) => {
          cur[r.id] = true;
        });
      }
      return { ...s, [tab]: cur };
    });
  }, [tab, allSelectedOnPage, rows]);

  // Clear selection for current tab
  const clearSelection = useCallback(() => {
    setSelected((s) => ({ ...s, [tab]: {} }));
  }, [tab]);

  // Calculate aggregated financial summary for selected rows
  const selSummary = useMemo(() => {
    if (!selIds.length || !adaptedData) return null;
    let spend = 0;
    let rev = 0;
    let sales = 0;
    const tabRows = adaptedData[tab] || [];

    selIds.forEach((id) => {
      const r = tabRows.find((x) => x.id === id);
      if (r) {
        spend += r.spend || 0;
        rev += r.rev || 0;
        sales += r.sales || 0;
      }
    });
    return { spend, rev, sales };
  }, [selIds, tab, adaptedData]);

  return {
    selected,
    tabSelected,
    selIds,
    selSummary,
    isCheckable,
    allSelectedOnPage,
    someSelectedOnPage,
    toggleRow,
    toggleAll,
    clearSelection,
  };
}

export default useReportSelection;