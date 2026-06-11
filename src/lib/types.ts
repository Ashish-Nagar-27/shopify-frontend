export type AccentKey = 'cyan' | 'emerald' | 'violet' | 'amber';
export type DensityKey = 'compact' | 'regular' | 'comfy';
export type ThemeKey = 'dark' | 'light';

export interface TweakState {
  accent: AccentKey;
  density: DensityKey;
  theme: ThemeKey;
}

export interface ChartDataPoint {
  label: string;
  full: string;
  sales: number;
  rev: number;
}

export interface KpiTile {
  label: string;
  val: string;
  unit: string;
  delta: string;
  pos: boolean;
  seed: number;
  hint: string;
}

export type ActionKind = 'scale' | 'pause' | 'refresh' | 'rebalance';
export type PriorityKey = 'high' | 'med' | 'low';
export type SourceKey = 'fb' | 'go' | 'tt';

export interface Action {
  id: string;
  kind: ActionKind;
  priority: PriorityKey;
  title: string;
  parent: string;
  source: SourceKey | null;
  trigger: { label: string; value: string; trend: string; positive: boolean };
  reason: string;
  suggested: string;
  impact: string;
  impactPositive: boolean | null;
}

export interface CampaignRow {
  id: string;
  source: SourceKey;
  status: 'active' | 'paused' | 'off';
  name: string;
  sub?: string;
  spend: number;
  rev: number;
  sales: number;
  reportedSale: number;
  roas: number;
  cpa: number;
  aov: number;
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  marginPct: number;
  children?: CampaignRow[];
  parentId?: string;
  campaignId?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  width: number;
  sticky?: boolean;
  align?: 'left' | 'center' | 'right';
  required?: boolean;
  num?: boolean;
  sortable?: boolean;
  info?: boolean;
  group: string;
}

export interface FilterState {
  clickHandling: string;
  window: string;
  model: string;
  event: string;
}
