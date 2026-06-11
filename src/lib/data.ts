import type { ChartDataPoint, KpiTile, Action, CampaignRow, ColumnDef, FilterState } from './types';

export const CHART: ChartDataPoint[] = [
  { label: "15", full: "Thu, 15 May 2026", sales: 185000, rev:  72000 },
  { label: "16", full: "Fri, 16 May 2026", sales: 198000, rev: 124000 },
  { label: "17", full: "Sat, 17 May 2026", sales: 214000, rev: 286000 },
  { label: "18", full: "Sun, 18 May 2026", sales: 196000, rev:  68000 },
  { label: "19", full: "Mon, 19 May 2026", sales: 168000, rev:  74000 },
  { label: "20", full: "Tue, 20 May 2026", sales: 162000, rev:  88000 },
  { label: "21", full: "Wed, 21 May 2026", sales: 160000, rev: 232000 },
];

export const KPIS: KpiTile[] = [
  { label: "Total Revenue", val: "745,301", unit: "₹", delta: "+21.7%", pos: true,  seed: 5,  hint: "from 612K" },
  { label: "Total Sales",   val: "1,261",   unit: "",  delta: "+15.1%", pos: true,  seed: 8,  hint: "from 1,096" },
  { label: "AOV",           val: "591.04",  unit: "₹", delta: "+5.8%",  pos: true,  seed: 14, hint: "from 558.55" },
  { label: "ROI",           val: "180.29",  unit: "%", delta: "+18.0%", pos: true,  seed: 21, hint: "from 152.79" },
  { label: "Blended ROAS",  val: "1.80",    unit: "×", delta: "−2.1%",  pos: false, seed: 27, hint: "from 1.84" },
];

export const ACTIONS: Action[] = [
  {
    id: "a1", kind: "scale", priority: "high",
    title: "Diabetes — Branded Search",
    parent: "Diabetes Awareness 22-4-26",
    source: "go",
    trigger: { label: "ROAS", value: "1.69×", trend: "+18%", positive: true },
    reason: "Best ROAS in account · only 12% of total budget — clear headroom to scale.",
    suggested: "+₹1,200/day",
    impact: "+₹4,800/wk projected rev",
    impactPositive: true,
  },
  {
    id: "a2", kind: "pause", priority: "high",
    title: "Men Podcast — 50, 60s",
    parent: "Acidity Gut category · 16-05-26",
    source: "fb",
    trigger: { label: "ROAS", value: "0.05×", trend: "5d streak", positive: false },
    reason: "Spent ₹20,304 for 21 sales · no improvement in 5 days · ad set fundamentally underperforming.",
    suggested: "Pause immediately",
    impact: "Save ~₹3,000/day",
    impactPositive: true,
  },
  {
    id: "a3", kind: "refresh", priority: "med",
    title: "Joint Pain — Spark Bottle Beauty",
    parent: "Joint Pain — Male 40-60",
    source: "tt",
    trigger: { label: "CTR", value: "↓ 34%", trend: "Freq 4.2", positive: false },
    reason: "CTR declining 7 days running · audience fatigue · creative hasn't refreshed in 16 days.",
    suggested: "Refresh creative",
    impact: "Restore ~1.4% CTR",
    impactPositive: null,
  },
  {
    id: "a4", kind: "rebalance", priority: "med",
    title: "Shift Joint Pain → Diabetes",
    parent: "Cross-channel budget",
    source: null,
    trigger: { label: "ΔROAS", value: "+0.95", trend: "Daily reach", positive: true },
    reason: "Reallocating from your lowest ROAS source to your highest yields strong net positive.",
    suggested: "Move ₹3,000/day",
    impact: "+₹4,800/wk projected rev",
    impactPositive: true,
  },
  {
    id: "a5", kind: "scale", priority: "med",
    title: "Acidity Gut — Reel Testimonial",
    parent: "USA · 25-44 · Mobile",
    source: "fb",
    trigger: { label: "ROAS", value: "1.12×", trend: "+9%", positive: true },
    reason: "Top performer in its ad set · creative is winning · can absorb more budget.",
    suggested: "+₹600/day",
    impact: "+₹2,100/wk projected rev",
    impactPositive: true,
  },
  {
    id: "a6", kind: "pause", priority: "low",
    title: "Podcast & Pills — Quote Card",
    parent: "Wellness Lookalike 1%",
    source: "fb",
    trigger: { label: "ROAS", value: "0.65×", trend: "−12%", positive: false },
    reason: "Declining trend over 4 days · already below adset average.",
    suggested: "Pause",
    impact: "Save ~₹500/day",
    impactPositive: true,
  },
  {
    id: "a7", kind: "refresh", priority: "low",
    title: "Diabetes — RSA Symptoms Set A",
    parent: "Diabetes — Symptoms",
    source: "go",
    trigger: { label: "CTR", value: "↓ 18%", trend: "Freq 3.4", positive: false },
    reason: "Headline rotation showing fatigue · test new variants of the symptoms hook.",
    suggested: "Add 3 RSA variants",
    impact: "Restore ~2.6% CTR",
    impactPositive: null,
  },
  {
    id: "a8", kind: "scale", priority: "low",
    title: "Diabetes — Symptoms Long-tail",
    parent: "Diabetes Awareness 22-4-26",
    source: "go",
    trigger: { label: "ROAS", value: "1.07×", trend: "+4%", positive: true },
    reason: "Quietly profitable · CPA stable · room for measured scale.",
    suggested: "+₹300/day",
    impact: "+₹900/wk projected rev",
    impactPositive: true,
  },
];

export const DATA: { campaign: CampaignRow[]; adset: CampaignRow[]; ad: CampaignRow[] } = {
  campaign: [
    { id: "c1", source: "fb", status: "active",
      name: "ACIDITY GUT 20-4-26", sub: "Conversions · Lifetime",
      spend: 2371, rev: 186436, sales: 599, reportedSale: 588,
      roas: 0.84, cpa: 4.0, aov: 311.2, cpm: 1.9, cpc: 0.15, ctr: 1.22,
      frequency: 2.1, marginPct: 38,
      children: [
        { id: "c1a", source: "fb", status: "active", name: "USA · 25-44 · Mobile",       spend: 1402, rev: 112318, sales: 372, reportedSale: 366, roas: 0.85, cpa: 3.77, aov: 301.9, cpm: 1.8, cpc: 0.14, ctr: 1.31, frequency: 2.0, marginPct: 39 },
        { id: "c1b", source: "fb", status: "active", name: "USA · 45-64 · All devices",  spend: 612,  rev:  46812, sales: 156, reportedSale: 152, roas: 0.81, cpa: 3.92, aov: 300.1, cpm: 2.1, cpc: 0.17, ctr: 1.11, frequency: 2.4, marginPct: 38 },
        { id: "c1c", source: "fb", status: "active", name: "CA · 30-55 · Stories",       spend: 357,  rev:  27306, sales:  71, reportedSale:  70, roas: 0.81, cpa: 5.02, aov: 384.6, cpm: 2.2, cpc: 0.18, ctr: 1.08, frequency: 2.6, marginPct: 36 },
      ]
    },
    { id: "c2", source: "fb", status: "active",
      name: "PODCAST AND PILLS ADS 27-4-26", sub: "Conversions · Daily",
      spend: 1387, rev: 86597, sales: 328, reportedSale: 317,
      roas: 0.66, cpa: 4.2, aov: 264.0, cpm: 1.9, cpc: 0.16, ctr: 1.22, frequency: 2.5, marginPct: 34 },
    { id: "c3", source: "fb", status: "active",
      name: "MEN PODCAST — OLD PEOPLE · 50, 60s · 16-05-26", sub: "Conversions · Lifetime",
      spend: 216, rev: 980, sales: 21, reportedSale: 20,
      roas: 0.05, cpa: 10.8, aov: 49.0, cpm: 5.2, cpc: 0.43, ctr: 1.05, frequency: 3.8, marginPct: 28 },
    { id: "c4", source: "go", status: "active",
      name: "DIABETES AWARENESS — SEARCH 22-4-26", sub: "Search · Performance Max",
      spend: 1604, rev: 218430, sales: 412, reportedSale: 408,
      roas: 1.45, cpa: 3.89, aov: 530.2, cpm: 2.6, cpc: 0.19, ctr: 2.41, frequency: 1.6, marginPct: 44 },
    { id: "c5", source: "tt", status: "paused",
      name: "JOINT PAIN REELS 30-4-26", sub: "Conversions · A/B test",
      spend: 928, rev: 64218, sales: 184, reportedSale: 179,
      roas: 0.74, cpa: 5.04, aov: 348.9, cpm: 2.1, cpc: 0.21, ctr: 1.42, frequency: 2.8, marginPct: 35 },
    { id: "c6", source: "fb", status: "off",
      name: "GENERAL WELLNESS RETARGETING", sub: "Retargeting · 7d window",
      spend: 0, rev: 0, sales: 0, reportedSale: 0,
      roas: 0, cpa: 0, aov: 0, cpm: 0, cpc: 0, ctr: 0, frequency: 0, marginPct: 0 },
  ],
  adset: [
    { id: "as1", parentId: "c1", source: "fb", status: "active", name: "USA · 25-44 · Mobile",            sub: "Acidity Gut 20-4-26",
      spend: 1402, rev: 112318, sales: 372, reportedSale: 366, roas: 0.85, cpa: 3.77, aov: 301.9, cpm: 1.8, cpc: 0.14, ctr: 1.31, frequency: 2.0, marginPct: 39 },
    { id: "as2", parentId: "c1", source: "fb", status: "active", name: "USA · 45-64 · All devices",       sub: "Acidity Gut 20-4-26",
      spend: 612,  rev: 46812,  sales: 156, reportedSale: 152, roas: 0.81, cpa: 3.92, aov: 300.1, cpm: 2.1, cpc: 0.17, ctr: 1.11, frequency: 2.4, marginPct: 38 },
    { id: "as3", parentId: "c2", source: "fb", status: "active", name: "Health Podcast Listeners 25-54",  sub: "Podcast and Pills 27-4-26",
      spend: 814,  rev: 51244,  sales: 198, reportedSale: 190, roas: 0.67, cpa: 4.11, aov: 258.8, cpm: 1.8, cpc: 0.15, ctr: 1.26, frequency: 2.3, marginPct: 34 },
    { id: "as4", parentId: "c2", source: "fb", status: "active", name: "Wellness Lookalike 1%",           sub: "Podcast and Pills 27-4-26",
      spend: 573,  rev: 35353,  sales: 130, reportedSale: 127, roas: 0.66, cpa: 4.41, aov: 271.9, cpm: 2.0, cpc: 0.17, ctr: 1.17, frequency: 2.7, marginPct: 34 },
    { id: "as5", parentId: "c4", source: "go", status: "active", name: "Diabetes — Branded Search",       sub: "Diabetes Awareness 22-4-26",
      spend: 982,  rev: 156112, sales: 281, reportedSale: 278, roas: 1.69, cpa: 3.49, aov: 555.6, cpm: 2.4, cpc: 0.18, ctr: 2.64, frequency: 1.5, marginPct: 46 },
    { id: "as6", parentId: "c4", source: "go", status: "active", name: "Diabetes — Symptoms Long-tail",   sub: "Diabetes Awareness 22-4-26",
      spend: 622,  rev: 62318,  sales: 131, reportedSale: 130, roas: 1.07, cpa: 4.75, aov: 475.7, cpm: 2.9, cpc: 0.21, ctr: 2.08, frequency: 1.8, marginPct: 42 },
    { id: "as7", parentId: "c5", source: "tt", status: "paused", name: "Joint Pain — Female 35-55",       sub: "Joint Pain Reels 30-4-26",
      spend: 511,  rev: 38104,  sales: 102, reportedSale:  99, roas: 0.79, cpa: 5.01, aov: 373.6, cpm: 2.0, cpc: 0.20, ctr: 1.48, frequency: 2.7, marginPct: 36 },
    { id: "as8", parentId: "c5", source: "tt", status: "paused", name: "Joint Pain — Male 40-60",         sub: "Joint Pain Reels 30-4-26",
      spend: 417,  rev: 26114,  sales:  82, reportedSale:  80, roas: 0.67, cpa: 5.09, aov: 318.5, cpm: 2.2, cpc: 0.22, ctr: 1.35, frequency: 2.9, marginPct: 34 },
  ],
  ad: [
    { id: "ad1", parentId: "as1", campaignId: "c1", source: "fb", status: "active", name: "Acidity Gut — Carousel · Before/After", sub: "USA · 25-44 · Mobile",
      spend: 781, rev: 64880, sales: 215, reportedSale: 211, roas: 0.88, cpa: 3.63, aov: 301.8, cpm: 1.7, cpc: 0.13, ctr: 1.35, frequency: 2.0, marginPct: 39 },
    { id: "ad2", parentId: "as1", campaignId: "c1", source: "fb", status: "active", name: "Acidity Gut — Reel · Testimonial 30s",  sub: "USA · 25-44 · Mobile",
      spend: 621, rev: 47438, sales: 157, reportedSale: 155, roas: 0.81, cpa: 3.95, aov: 302.1, cpm: 1.9, cpc: 0.15, ctr: 1.26, frequency: 2.2, marginPct: 38 },
    { id: "ad3", parentId: "as2", campaignId: "c1", source: "fb", status: "active", name: "Acidity Gut — Static · Founder Quote",  sub: "USA · 45-64 · All devices",
      spend: 358, rev: 27814, sales:  93, reportedSale:  91, roas: 0.83, cpa: 3.85, aov: 299.1, cpm: 2.0, cpc: 0.16, ctr: 1.18, frequency: 2.4, marginPct: 38 },
    { id: "ad4", parentId: "as3", campaignId: "c2", source: "fb", status: "active", name: "Podcast & Pills — Mid-roll Audio Hook", sub: "Health Podcast Listeners",
      spend: 502, rev: 33240, sales: 124, reportedSale: 119, roas: 0.70, cpa: 4.05, aov: 268.1, cpm: 1.7, cpc: 0.14, ctr: 1.29, frequency: 2.3, marginPct: 35 },
    { id: "ad5", parentId: "as4", campaignId: "c2", source: "fb", status: "paused", name: "Podcast & Pills — Static Quote Card",   sub: "Wellness Lookalike 1%",
      spend: 312, rev: 19204, sales:  71, reportedSale:  70, roas: 0.65, cpa: 4.40, aov: 270.5, cpm: 2.1, cpc: 0.18, ctr: 1.14, frequency: 2.6, marginPct: 33 },
    { id: "ad6", parentId: "as5", campaignId: "c4", source: "go", status: "active", name: "Diabetes — Headline · 'Reverse in 90d'", sub: "Diabetes — Branded Search",
      spend: 642, rev: 102230, sales: 184, reportedSale: 182, roas: 1.69, cpa: 3.49, aov: 555.6, cpm: 2.3, cpc: 0.17, ctr: 2.71, frequency: 1.5, marginPct: 46 },
    { id: "ad7", parentId: "as6", campaignId: "c4", source: "go", status: "active", name: "Diabetes — RSA · Symptoms Set A",        sub: "Diabetes — Symptoms",
      spend: 384, rev: 38478, sales:  81, reportedSale:  80, roas: 1.07, cpa: 4.74, aov: 475.0, cpm: 2.8, cpc: 0.20, ctr: 2.12, frequency: 1.7, marginPct: 42 },
    { id: "ad8", parentId: "as7", campaignId: "c5", source: "tt", status: "paused", name: "Joint Pain — UGC · 'My Mom' 22s",        sub: "Joint Pain — Female 35-55",
      spend: 318, rev: 23734, sales:  64, reportedSale:  62, roas: 0.79, cpa: 4.97, aov: 370.8, cpm: 2.0, cpc: 0.20, ctr: 1.51, frequency: 2.7, marginPct: 36 },
    { id: "ad9", parentId: "as8", campaignId: "c5", source: "tt", status: "paused", name: "Joint Pain — Spark · Bottle Beauty",     sub: "Joint Pain — Male 40-60",
      spend: 251, rev: 15710, sales:  49, reportedSale:  48, roas: 0.67, cpa: 5.12, aov: 320.6, cpm: 2.2, cpc: 0.22, ctr: 1.34, frequency: 2.8, marginPct: 33 },
  ],
};

export const ALL_COLUMNS: ColumnDef[] = [
  { key: "name",         label: "Name",               width: 320, sticky: true, align: "left", required: true,  group: "Identity" },
  { key: "status",       label: "Status",             width: 100, align: "center",              required: true,  group: "Identity" },
  { key: "spend",        label: "Spend",              width: 100, num: true, group: "Cost" },
  { key: "cpa",          label: "CPA",                width: 80,  num: true, group: "Cost" },
  { key: "cpm",          label: "CPM",                width: 80,  num: true, group: "Cost" },
  { key: "cpc",          label: "CPC",                width: 80,  num: true, group: "Cost" },
  { key: "cpl",          label: "CPL",                width: 80,  num: true, group: "Cost" },
  { key: "rev",          label: "Rev",                width: 110, num: true, info: true, group: "Revenue" },
  { key: "sales",        label: "Order",              width: 90,  num: true, group: "Revenue" },
  { key: "reportedSale", label: "Ads Platform Order", width: 160, num: true, group: "Revenue" },
  { key: "roas",         label: "ROAS",               width: 90,  num: true, group: "Revenue" },
  { key: "aov",          label: "AOV",                width: 90,  num: true, group: "Revenue" },
  { key: "marginPct",    label: "Margin %",           width: 100, num: true, group: "Revenue" },
  { key: "leads",        label: "Leads",              width: 80,  num: true, group: "Engagement" },
  { key: "ctr",          label: "CTR %",              width: 80,  num: true, group: "Engagement" },
  { key: "frequency",    label: "Frequency",          width: 100, num: true, group: "Engagement" },
  { key: "impressions",  label: "Impressions",        width: 110, num: true, group: "Engagement" },
  { key: "clicks",       label: "Clicks",             width: 90,  num: true, group: "Engagement" },
  { key: "reach",        label: "Reach",              width: 90,  num: true, group: "Engagement" },
  { key: "videoViews",   label: "Video Views",        width: 110, num: true, group: "Engagement" },
  { key: "videoP25",     label: "Video 25%",          width: 100, num: true, group: "Engagement" },
  { key: "videoP50",     label: "Video 50%",          width: 100, num: true, group: "Engagement" },
  { key: "videoP75",     label: "Video 75%",          width: 100, num: true, group: "Engagement" },
  { key: "videoP100",    label: "Video 100%",         width: 100, num: true, group: "Engagement" },
  { key: "atc",          label: "Add to Cart",        width: 110, num: true, group: "Funnel" },
  { key: "checkout",     label: "Checkout",           width: 100, num: true, group: "Funnel" },
  { key: "newCust",      label: "New Customers",      width: 130, num: true, group: "Retention" },
  { key: "returningCust",label: "Returning",          width: 100, num: true, group: "Retention" },
  { key: "ltv",          label: "LTV (60d)",          width: 100, num: true, group: "Retention" },
  { key: "trafficScore", label: "Traffic Score",      width: 110, num: true, group: "Engagement" },
];

export const COL_BY_KEY: Record<string, ColumnDef> = Object.fromEntries(ALL_COLUMNS.map(c => [c.key, c]));

export const DEFAULT_VISIBLE = ["name", "status", "spend", "rev", "sales", "reportedSale", "roas", "cpa", "aov", "cpm", "cpc", "ctr"];

export const COLUMN_PRESETS: Record<string, string[]> = {
  "Default":               DEFAULT_VISIBLE,
  "New vs Returning":      ["name", "status", "spend", "rev", "sales", "newCust", "returningCust", "ltv", "aov", "roas"],
  "Engagement & Traffic":  ["name", "status", "spend", "impressions", "reach", "clicks", "ctr", "cpc", "cpm", "frequency", "videoViews"],
};

export const FILTER_OPTIONS: Record<string, Array<{ value: string; label: string; desc: string }>> = {
  clickHandling: [
    { value: "ignore",  label: "Ignore non-paid clicks", desc: "Recommended — strips organic & internal clicks" },
    { value: "all",     label: "Include all clicks",     desc: "Counts every click attribution platform records" },
    { value: "paid",    label: "Only paid clicks",       desc: "Strictest — only paid-media touches" },
  ],
  window: [
    { value: "1d",   label: "1-day click",              desc: "Same-day attribution only" },
    { value: "7d",   label: "7-day click",              desc: "Standard for most accounts" },
    { value: "28d",  label: "28-day click",             desc: "Long sales cycles & high AOV" },
    { value: "7d1d", label: "7-day click + 1-day view", desc: "Default match to Meta" },
  ],
  model: [
    { value: "last",   label: "Last touch",   desc: "Credit to the final paid touch" },
    { value: "first",  label: "First touch",  desc: "Credit to the first paid touch" },
    { value: "linear", label: "Linear",       desc: "Even credit across all touches" },
    { value: "u",      label: "U-shaped",     desc: "Heavy first & last, light middle" },
    { value: "decay",  label: "Time decay",   desc: "Recent touches weighted more" },
  ],
  event: [
    { value: "purchase", label: "Purchase",          desc: "Primary conversion event" },
    { value: "atc",      label: "Add to Cart",       desc: "Upstream funnel event" },
    { value: "lead",     label: "Lead",              desc: "Form submit / sign-up" },
    { value: "checkout", label: "Initiate Checkout", desc: "Mid-funnel event" },
  ],
};

export const FILTER_DEFAULTS: FilterState = {
  clickHandling: "ignore",
  window:        "7d1d",
  model:         "last",
  event:         "purchase",
};

// Derive missing columns from canonical row
export function derived(row: CampaignRow, key: string): number {
  const rowRecord = row as Record<string, number | undefined>;
  if (rowRecord[key] !== undefined) return rowRecord[key] as number;
  const cpm = row.cpm || 2;
  const ctr = row.ctr || 1;
  const spend = row.spend || 0;
  const impressions = spend && cpm ? Math.round((spend / cpm) * 1000) : 0;
  const clicks      = Math.round(impressions * ctr / 100);
  const frequency   = row.frequency || 2.2;
  const reach       = frequency ? Math.round(impressions / frequency) : 0;
  switch (key) {
    case "impressions":   return impressions;
    case "clicks":        return clicks;
    case "reach":         return reach;
    case "videoViews":    return Math.round(impressions * 0.42);
    case "videoP25":      return Math.round(impressions * 0.30);
    case "videoP50":      return Math.round(impressions * 0.20);
    case "videoP75":      return Math.round(impressions * 0.12);
    case "videoP100":     return Math.round(impressions * 0.06);
    case "leads":         return Math.round((row.sales || 0) * 1.4);
    case "cpl":           return row.sales ? +((spend / (row.sales * 1.4)).toFixed(2)) : 0;
    case "atc":           return Math.round((row.sales || 0) * 4.6);
    case "checkout":      return Math.round((row.sales || 0) * 1.5);
    case "newCust":       return Math.round((row.sales || 0) * 0.68);
    case "returningCust": return (row.sales || 0) - Math.round((row.sales || 0) * 0.68);
    case "ltv":           return row.aov ? +(row.aov * 1.6).toFixed(2) : 0;
    case "trafficScore":  return Math.round(40 + (row.ctr || 0) * 25);
    case "marginPct":     return row.marginPct ?? 35;
    case "frequency":     return frequency;
    default:              return 0;
  }
}
