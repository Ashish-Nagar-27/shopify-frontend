import { DATA, derived } from '@/lib/data';
import type { CampaignRow } from '@/lib/types';

export interface ReportFetchParams {
  tab: 'campaign' | 'adset' | 'ad';
  search?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  drill?: {
    fromTab: 'campaign' | 'adset' | 'ad';
    targetTab: 'campaign' | 'adset' | 'ad';
    ids: string[];
  } | null;
}

export interface ReportFetchResponse {
  rows: CampaignRow[];
  totalCount: number;
}

/**
 * Simulates fetching reporting data from an API with a 300ms network delay.
 */
export function fetchReportData(params: ReportFetchParams): Promise<ReportFetchResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...(DATA[params.tab] || [])];

      // 1. Filter by drilldown state
      if (params.drill && params.drill.targetTab === params.tab) {
        const idSet = new Set(params.drill.ids);
        if (params.drill.fromTab === 'campaign' && params.tab === 'adset') {
          rows = rows.filter(r => idSet.has(r.parentId || ''));
        } else if (params.drill.fromTab === 'adset' && params.tab === 'ad') {
          rows = rows.filter(r => idSet.has(r.parentId || ''));
        } else if (params.drill.fromTab === 'campaign' && params.tab === 'ad') {
          rows = rows.filter(r => idSet.has(r.campaignId || ''));
        }
      }

      const totalCount = DATA[params.tab]?.length || 0;

      // 2. Filter by search query
      if (params.search) {
        const query = params.search.toLowerCase();
        rows = rows.filter(r => (r.name + ' ' + (r.sub || '')).toLowerCase().includes(query));
      }

      // 3. Sort rows
      if (params.sortKey) {
        const key = params.sortKey;
        const dir = params.sortDir || 'desc';
        rows.sort((a, b) => {
          const av = derived(a, key) || 0;
          const bv = derived(b, key) || 0;
          return dir === 'asc' ? av - bv : bv - av;
        });
      }

      resolve({
        rows,
        totalCount,
      });
    }, 300);
  });
}
