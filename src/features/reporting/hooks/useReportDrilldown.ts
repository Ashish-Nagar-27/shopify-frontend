import { useState, useCallback, useEffect } from 'react';
import type { CampaignRow, DrillState, TabKey } from '@/lib/types';

interface UseReportDrilldownOptions {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  onAfterDrill?: () => void;
}

export function useReportDrilldown({ tab, setTab, onAfterDrill }: UseReportDrilldownOptions) {
  const [drill, setDrill] = useState<DrillState | null>(null);

  const clearDrill = useCallback(() => {
    setDrill(null);
  }, []);

  const drillTo = useCallback(
    (target: TabKey, selIds: string[], adaptedData: Record<TabKey, CampaignRow[]>) => {
      if (!selIds.length) return;
      const currentRows = adaptedData[tab] || [];
      const rowsById = Object.fromEntries(currentRows.map((r) => [r.id, r]));
      const labels = selIds.map((id) => rowsById[id]?.name).filter(Boolean) as string[];

      setDrill({
        fromTab: tab,
        targetTab: target,
        ids: selIds,
        labels,
      });

      setTab(target);
      onAfterDrill?.();
    },
    [tab, setTab, onAfterDrill]
  );

  // Automatically reset drilldown state if tab changes independently
  useEffect(() => {
    if (drill && drill.targetTab !== tab) {
      setDrill(null);
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    drill,
    drillTo,
    clearDrill,
  };
}

export default useReportDrilldown;
