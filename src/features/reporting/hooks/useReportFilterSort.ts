import { useState, useMemo, useCallback } from 'react';
import { derived } from '@/lib/data';
import type { CampaignRow, DrillState, TabKey } from '@/lib/types';

interface UseReportFilterSortOptions {
  adaptedData: Record<TabKey, CampaignRow[]>;
  tab: TabKey;
  drill: DrillState | null;
  account?: string;
  initialSortKey?: string;
  initialSortDir?: 'asc' | 'desc';
}

export function useReportFilterSort({
  adaptedData,
  tab,
  drill,
  account,
  initialSortKey = 'Spend',
  initialSortDir = 'desc',
}: UseReportFilterSortOptions) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialSortDir);

  // Toggle sort direction or update sort key
  const setSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey]
  );

  // Filtered and sorted rows for active tab
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
    if (search.trim()) {
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

  // Tab row count metrics
  const tabCounts = useMemo<Record<TabKey, number>>(() => {
    const getBaseRows = (t: TabKey) => {
      let r = adaptedData[t] || [];
      if (drill && drill.targetTab === t) {
        const idSet = new Set(drill.ids);
        if (drill.fromTab === 'campaign' && t === 'adset') {
          r = r.filter((x) => idSet.has(x.parentId || ''));
        } else if (drill.fromTab === 'adset' && t === 'ad') {
          r = r.filter((x) => idSet.has(x.parentId || ''));
        } else if (drill.fromTab === 'campaign' && t === 'ad') {
          r = r.filter((x) => idSet.has(x.campaignId || ''));
        }
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

  return {
    search,
    setSearch,
    sortKey,
    sortDir,
    setSort,
    rows,
    tabCounts,
  };
}

export default useReportFilterSort;
