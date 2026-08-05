// types/reporting.ts
export interface CampaignRow {
  campaign_name: string;
  campaign_status: string;
  campaign_id: string;
  Spend: number;
  Revenue: number;
  Sales: number;
  ROAS: number | string;
  CPA: number | string;
  CPC: number | string;
  "CTR %": number | string;
  "CR %": number | string;
  Clicks: number;
  Impression: number;
  AOV: number | string;
  Profit: number;
  "New Visits": number;
  "New Visits %": number | string;
}

// API Parameter & Data Models

export interface RawAdData {
  ad_id: string;
  ad_name: string;
  ad_status: string;
  source?: string;
  Sales?: number | string;
  Spend?: number | string;
  Revenue?: number | string;
  ReportedSale?: number | string;
  "Reported Sale"?: number | string;
  ROAS?: number | string;
  CPA?: number | string;
  AOV?: number | string;
  CPM?: number | string;
  CPC?: number | string;
  CPL?: number | string;
  CTR?: number | string;
  "CTR %"?: number | string;
  avg_touches_per_order?: number | string;
  frequency?: number | string;
  "Gross Margin %"?: number | string;
  marginPct?: number | string;
  Impression?: number | string;
  Impressions?: number | string;
  Clicks?: number | string;
  Leads?: number | string;
  ATC?: number | string;
  "New Visits"?: number | string;
  [key: string]: unknown;
}

export interface RawAdSetData extends RawAdData {
  ad_set_id: string;
  ad_set_name: string;
  ad_set_status: string;
  ads?: RawAdData[];
}

export interface RawCampaignData extends RawAdData {
  campaign_id: string;
  campaign_name: string;
  campaign_status: string;
  ad_sets?: RawAdSetData[];
}

export interface ReportingTableDataResponse {
  campaign?: RawCampaignData[];
  [key: string]: unknown;
}

export interface GraphSalesMetricValue {
  val?: number | string;
  prev_val?: number | string;
  diff?: number | string;
  diff_pct?: number | string;
  pct?: number | string;
  spark?: number[];
  seed?: number;
  unit?: string;
  [key: string]: unknown;
}

export interface GraphSalesMetricsResponse {
  total_revenue?: GraphSalesMetricValue;
  total_sales?: GraphSalesMetricValue;
  aov?: GraphSalesMetricValue;
  roi?: GraphSalesMetricValue;
  blended_roas?: GraphSalesMetricValue;
  [key: string]: unknown;
}

export interface GraphSalesResponse {
  dates?: string[];
  series?: Array<{
    name: string;
    data: number[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface ActionOption {
  id?: string | number;
  label?: string;
  value?: string;
  [key: string]: unknown;
}

export type ActionsResponse = ActionOption[] | { data?: ActionOption[]; [key: string]: unknown };

export interface SourceItem {
  id?: string | number;
  name?: string;
  value?: string;
  [key: string]: unknown;
}

export type SourceResponse = SourceItem[] | { data?: SourceItem[]; [key: string]: unknown };

export interface AdsAccountItem {
  id?: string | number;
  account_id?: string;
  account_name?: string;
  channel?: string;
  status?: string;
  [key: string]: unknown;
}

export type AdsAccountsResponse = AdsAccountItem[] | { data?: AdsAccountItem[]; [key: string]: unknown };

export interface CustomizedColumnItem {
  field: string;
  seq: number;
  workspace?: string | number;
}

export interface CustomizedColumnsResponse {
  data?: CustomizedColumnItem[];
  status?: string | number;
  message?: string;
  [key: string]: unknown;
}

export interface CustomizeColumnMutationResponse {
  status?: string | number;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface ReportingSaleDataRow {
  complete_name?: string;
  email_phone?: string;
  total?: number | string;
  order_date?: string;
  trackid?: string;
  [key: string]: unknown;
}

export type ReportingTableSaleDataResponse = ReportingSaleDataRow[];

export interface SaleJourneyTouchpoint {
  timestamp?: string;
  source?: string;
  channel?: string;
  campaign?: string;
  adset?: string;
  ad?: string;
  action?: string;
  [key: string]: unknown;
}

export interface TableSaleJourneyResponse {
  data?: {
    journey?: SaleJourneyTouchpoint[];
    [key: string]: unknown;
  } | SaleJourneyTouchpoint[];
  journey?: SaleJourneyTouchpoint[];
  [key: string]: unknown;
}

export interface CustomerProfileData {
  name?: string;
  email?: string;
  phone?: string;
  customerSince?: string;
  [key: string]: unknown;
}

export interface CustomerOrderData {
  order_id?: string;
  amount?: number | string;
  date?: string;
  status?: string;
  [key: string]: unknown;
}

export interface CustomerProfileResponse {
  data?: {
    profile?: CustomerProfileData;
    kpis?: Record<string, unknown>;
    orders?: CustomerOrderData[];
    journey?: SaleJourneyTouchpoint[];
    [key: string]: unknown;
  };
  profile?: CustomerProfileData;
  kpis?: Record<string, unknown>;
  orders?: CustomerOrderData[];
  journey?: SaleJourneyTouchpoint[];
  [key: string]: unknown;
}