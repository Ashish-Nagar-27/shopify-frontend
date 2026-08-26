export type CreativeFormat = "Video" | "Carousel" | "Static";
export type CreativeStatus = "winner" | "fatigue" | "testing" | "kill";

export interface Creative {
  id: string;
  name: string;
  fmt: CreativeFormat;
  hue: number;
  spend: number;
  rev: number;
  roas: number;
  cpa: number;
  hook: number;
  hold: number;
  ctr: number;
  freq: number;
  trend: number[];
  status: CreativeStatus;
}

export interface StatusMeta {
  label: string;
  cls: CreativeStatus;
}

export interface ApiFunnelMetric {
  benchmark: number;
  leak: boolean;
  value: number;
}

export interface ApiFunnelData {
  ctr?: ApiFunnelMetric;
  cvr?: ApiFunnelMetric;
  hold?: ApiFunnelMetric;
  hook?: ApiFunnelMetric;
}

export interface FunnelStage {
  n: number;
  label: string;
  val: string;
  pct: number;
  bench: string;
  good: boolean;
  hint: string;
  leak?: boolean;
}

export interface CreativeAction {
  kind: "scale" | "refresh" | "kill";
  tag: string;
  cr: Creative;
  why: string;
  stat: string;
  statL: string;
}

// API Response Types matching GET /creative/creativeinsights/facebook
export interface FacebookCreativeAction {
  body: string;
  creative_id: string;
  creative_name: string;
  creative_type: string;
  headline: string;
  impact_label: string;
  impact_value: number | null;
  kind: "scale" | "refresh" | "kill" | string;
}

export interface FacebookCreativeTrendPoint {
  ctr: number;
  date: string;
}

export interface FacebookCreativeItem {
  creative_id: string;
  creative_name: string;
  ctr: number;
  ctr_trend_7d?: FacebookCreativeTrendPoint[];
  cvr: number;
  format: string;
  frequency: number;
  hold: number;
  hook: number;
  revenue: number;
  roas: number;
  spend: number;
  status: "winner" | "fatigue" | "testing" | "kill" | string;
  hue?: number;
  cpa?: number;
}

export interface FacebookFunnelMetric {
  benchmark: number;
  leak: boolean;
  value: number;
}

export interface FacebookCreativeFunnel {
  ctr: FacebookFunnelMetric;
  cvr: FacebookFunnelMetric;
  hold: FacebookFunnelMetric;
  hook: FacebookFunnelMetric;
}

export interface FacebookCreativeMeta {
  compared_to?: string;
  period_days?: number;
  sparkline_window?: string;
  spend_floor_used?: number;
}

export interface FacebookCreativeScatterItem {
  creative_id: string;
  creative_name: string;
  frequency: number;
  revenue: number;
  roas: number;
  spend: number;
  status: "winner" | "fatigue" | "testing" | "kill" | string;
}

export interface FacebookCreativeTotals {
  blended_roas: number;
  revenue: number;
  spend: number;
}

export interface FacebookCreativeInsightsResponse {
  actions: FacebookCreativeAction[];
  creatives: FacebookCreativeItem[];
  funnel: FacebookCreativeFunnel;
  meta?: FacebookCreativeMeta;
  scatter?: FacebookCreativeScatterItem[];
  totals: FacebookCreativeTotals;
}
