import { create } from 'zustand';
import type { FilterState } from '@/lib/types';
import { FILTER_DEFAULTS } from '@/lib/data';

interface ReportingState {
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  updateFilter: (update: Partial<FilterState>) => void;
  traffic: string;
  account: string;
  setTraffic: (traffic: string) => void;
  setAccount: (account: string) => void;
}

export const useReportingStore = create<ReportingState>((set) => ({
  filter: FILTER_DEFAULTS,
  setFilter: (filter) => set({ filter }),
  updateFilter: (update) => set((state) => ({ filter: { ...state.filter, ...update } })),
  traffic: "Facebook",
  account: "All",
  setTraffic: (traffic) => set({ traffic }),
  setAccount: (account) => set({ account }),
}));
