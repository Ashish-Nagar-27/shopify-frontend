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