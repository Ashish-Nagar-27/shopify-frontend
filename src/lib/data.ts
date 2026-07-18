import type {  Action, CampaignRow, ColumnDef, FilterState } from './types';




import { BACKEND_MOCK_DATA } from '@/mocks/reportData';
import { adaptBackendData } from '@/features/reporting/utils/adapter';

export const DATA = adaptBackendData(BACKEND_MOCK_DATA);


export const ALL_COLUMNS: ColumnDef[] = [
  { key: "name",                  label: "Name",                  width: 320, sticky: true, align: "left", required: true,  group: "Identity" },
  { key: "status",                label: "Status",                width: 100, align: "center",              required: true,  group: "Identity" },
  
  // Cost Group
  { key: "Spend",                 label: "Spend",                 width: 100, num: true, group: "Cost",align: "center",   },
  { key: "Cost",                  label: "Cost",                  width: 100, num: true, group: "Cost" },
  { key: "nSpend",                label: "nSpend",                width: 100, num: true, group: "Cost" },
  { key: "CPA",                   label: "CPA",                   width: 80,  num: true, group: "Cost" },
  { key: "Reported CPA",          label: "Reported CPA",          width: 120, num: true, group: "Cost" },
  { key: "nCPA",                  label: "nCPA",                  width: 100, num: true, group: "Cost" ,  info: true, infoText: "New Customer CPA"},
  { key: "CPC",                   label: "CPC",                   width: 80,  num: true, group: "Cost" },
  { key: "nCPC",                  label: "nCPC",                  width: 100, num: true, group: "Cost",  info: true, infoText: "New Customer CPC" },
  { key: "CPM",                   label: "CPM",                   width: 80,  num: true, group: "Cost" },
  { key: "CPL",                   label: "CPL",                   width: 80,  num: true, group: "Cost" },
  { key: "eCPNV",                 label: "eCPNV",                 width: 100, num: true, group: "Cost",  info: true, infoText: "Effective Cost Per New Visit" },

  // Revenue Group
  { key: "Revenue",               label: "Rev",               width: 110, num: true,  group: "Revenue", align: "center", info: true, infoText: "Revenue"   },
  { key: "Reported Rev",          label: "Reported Rev",          width: 120, num: true, group: "Revenue" },
  { key: "nRev",              label: "nRevenue",              width: 110, num: true, group: "Revenue" , info: true, infoText: "New Customer Revenue" },
  { key: "rRevenue",              label: "rRevenue",              width: 110, num: true, group: "Revenue" },
  { key: "Sales",                 label: "Order",                 width: 90,  num: true, group: "Revenue", align: "center" },
  { key: "Reported Sale",         label: "Ads Platform Order",    width: 160, num: true, group: "Revenue", align: "center",   },
  { key: "nSales",                label: "nSales",                width: 100, num: true, group: "Revenue" ,  info: true, infoText: "New Customer Sales" },
  { key: "rSales",                label: "rSales",                width: 100, num: true, group: "Revenue" },
  { key: "ROAS",                  label: "ROAS",                  width: 90,  num: true, group: "Revenue" , info: true, infoText: "New Customer ROAS"},
  { key: "Reported ROAS",         label: "Reported ROAS",         width: 120, num: true, group: "Revenue" },
  { key: "nROAS",                 label: "nROAS",                 width: 100, num: true, group: "Revenue" },
  { key: "AOV",                   label: "AOV",                   width: 90,  num: true, group: "Revenue" },
  { key: "nAOV",                  label: "nAOV",                  width: 100, num: true, group: "Revenue" ,  info: true, infoText: "New Customer AOV"},
  { key: "Gross Margin %",        label: "Margin %",              width: 100, num: true, group: "Revenue" },
  { key: "Gross Profit",          label: "Gross Profit",          width: 120, num: true, group: "Revenue" },
  { key: "Profit",                label: "Profit",                width: 110, num: true, group: "Revenue" },
  { key: "CancelOrder",           label: "Cancelled Orders",      width: 130, num: true, group: "Revenue" },
  { key: "CancelRev",             label: "Cancelled Rev",         width: 120, num: true, group: "Revenue" },

  // Engagement Group
  { key: "Impression",            label: "Impressions",           width: 110, num: true, group: "Engagement" },
  { key: "Clicks",                label: "Clicks",                width: 90,  num: true, group: "Engagement" },
  { key: "CTR %",                 label: "CTR %",                 width: 80,  num: true, group: "Engagement",align: "center" },
  { key: "Leads",                 label: "Leads",                 width: 80,  num: true, group: "Engagement" },
  { key: "avg_touches_per_order", label: "Frequency",             width: 100, num: true, group: "Engagement" , info: true, infoText: "Avergage Touches Per order"},
  { key: "total_touch_count",     label: "Total Touch Count",     width: 130, num: true, group: "Engagement" , info: true , infoText: "Total Touch Count"},
  { key: "reach",                 label: "Reach",                 width: 90,  num: true, group: "Engagement" },
  { key: "trafficScore",          label: "Traffic Score",         width: 110, num: true, group: "Engagement" },
  { key: "videoViews",            label: "Video Views",           width: 110, num: true, group: "Engagement" },
  { key: "videoP25",              label: "Video 25%",             width: 100, num: true, group: "Engagement" },
  { key: "videoP50",              label: "Video 50%",             width: 100, num: true, group: "Engagement" },
  { key: "videoP75",              label: "Video 75%",             width: 100, num: true, group: "Engagement" },
  { key: "videoP100",             label: "Video 100%",            width: 100, num: true, group: "Engagement" },

  // Funnel Group
  { key: "ATC",                   label: "Add to Cart",           width: 110, num: true, group: "Funnel" ,  info: true, infoText: "Add to Cart"},
  { key: "checkout",              label: "Checkout",              width: 100, num: true, group: "Funnel" },
  { key: "CR %",                  label: "CR %",                  width: 90,  num: true, group: "Funnel" },
  { key: "nCR %",                 label: "nCR %",                 width: 100, num: true, group: "Funnel" ,  info: true, infoText: "New Customer CR"},
  { key: "Cart to Sales %",       label: "Cart to Sales %",       width: 130, num: true, group: "Funnel" },
  { key: "appears_in_orders",     label: "ATP",     width: 140, num: true, group: "Funnel" , info: true, infoText: "Appears In Orders"},
  { key: "first_touch",           label: "FTP",           width: 110, num: true, group: "Funnel" , info: true, infoText: "First Touch Point"},
  { key: "first_touch_pct",       label: "First Touch %",         width: 120, num: true, group: "Funnel" },
  { key: "solo_orders",           label: "SO",           width: 110, num: true, group: "Funnel", info: true, infoText: "Single Touch Point Order" },

  // Retention Group
  { key: "New Visits",            label: "New Customers",         width: 130, num: true, group: "Retention" , info: true, infoText: "New Website Visitor"},
  { key: "New Visits %",          label: "New Visits %",          width: 110, num: true, group: "Retention" , info: true, infoText: "New Website Visitor %" },
  { key: "returningCust",         label: "Returning",             width: 100, num: true, group: "Retention" },
  { key: "ltv",                   label: "LTV (60d)",             width: 100, num: true, group: "Retention" },
  { key: "nvisitor",              label: "nvisitor",              width: 100, num: true, group: "Retention" },
  { key: "visitor",               label: "Visitor",               width: 100, num: true, group: "Retention" },

  // Identity / Metadata Columns (available but not visible by default)
  { key: "Creative",              label: "Creative",              width: 150, group: "Identity" },
  { key: "Product Name",          label: "Product Name",          width: 150, group: "Identity" },
  { key: "campaign_id",           label: "Campaign ID",           width: 150, group: "Identity" },
  { key: "campaign_name",         label: "Campaign Name",         width: 150, group: "Identity" },
  { key: "campaign_status",       label: "Campaign Status",       width: 120, group: "Identity" },
  { key: "source",                label: "Source",                width: 100, group: "Identity" },
];

export const COL_BY_KEY: Record<string, ColumnDef> = Object.fromEntries(ALL_COLUMNS.map(c => [c.key, c]));

export const DEFAULT_VISIBLE = [
        "Spend", "Revenue", "Sales", "Reported Sale", "ROAS",
        "CPA", "Reported CPA", "AOV", "CPM", "CPC", "CTR %",
        "CR %", "nRevenue", "nSales", "nROAS", "nAOV", "nCPA",
        "nCPC", "nCR %", "eCPNV", "New Visits", "New Visits %",
        "Profit", "Gross Margin %", "Gross Profit"
    ]
    
export const NEW_VS_RETURNING = [
        "Impression", "Clicks", "Spend", "New Visits", "New Visits %",
        "nSales", "rSales", "nRevenue", "rRevenue", "nCR %", "nCPC", "nROAS"
    ]

export const ENGAGEMENT_AND_TRAFFIC = [
        "Spend", "Impression", "Clicks", "CTR %",
        "New Visits", "New Visits %", "eCPNV", "CPC", "nCPC"
    ]

const generateColumns = (presets: string[]) => presets.map(preset => COL_BY_KEY[preset]).filter(col => col !== undefined);



export const COLUMN_PRESETS: Record<string, ColumnDef[]> = {
  "Default":               generateColumns(DEFAULT_VISIBLE),
  "New vs Returning":      generateColumns(NEW_VS_RETURNING),
  "Engagement & Traffic":  generateColumns(ENGAGEMENT_AND_TRAFFIC),
};

export const mapPresetViewName = (presetName: string): string => {
  switch (presetName) {
    case 'Default':
      return 'default';
    case 'New vs Returning':
      return 'newVsreturning';
    case 'Engagement & Traffic':
      return 'engagementAndTraffic';
    default:
      return 'myview';
  }
};

export const FILTER_OPTIONS: Record<string, Array<{ value: string; label: string; desc: string }>> = {
  clickHandling: [
    { value: "other",  label: "Ignore non-paid clicks", desc: "Recommended — strips organic & internal clicks" },
    { value: "all",     label: "Include all clicks",     desc: "Counts every click attribution platform records" },
    { value: "paid",    label: "Only paid clicks",       desc: "Strictest — only paid-media touches" },
  ],
  window: [
    { value: "999",   label: "Lifetime",              desc: "All attributed activity" },
    { value: "15",   label: "15-day click",              desc: "Standard for most accounts" },
    { value: "30",  label: "30-day click",             desc: "Long sales cycles & high AOV" },
    { value: "60",  label: "60-day click",             desc: "Long sales cycles & high AOV" },
    { value: "180",  label: "180-day click",             desc: "Long sales cycles & high AOV" },

  ],
  model: [
    { value: "last",   label: "Last touch",   desc: "Credit to the final paid touch" },
    { value: "first",  label: "First touch",  desc: "Credit to the first paid touch" },
  ],
  event: [
    { value: "purchase", label: "Purchase",          desc: "Primary conversion event" },
    { value: "atc",      label: "Add to Cart",       desc: "Upstream funnel event" },
    { value: "lead",     label: "Lead",              desc: "Form submit / sign-up" },
    { value: "checkout", label: "Initiate Checkout", desc: "Mid-funnel event" },
  ],
};

export const FILTER_DEFAULTS: FilterState = {
  clickHandling: "paid",
  window:        "999",
  model:         "last",
  event:         "purchase",
};

// Derive missing columns from canonical row
export function derived(row: CampaignRow, key: string): number {
  const rowRecord = row as unknown as Record<string, any>;
  
  // Try exact key first
  if (rowRecord[key] !== undefined) {
    const val = rowRecord[key];
    if (val === 'n/a' || val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  // Try lowercase key for camelCase fallback
  const lKey = key.toLowerCase();
  
  // Mappings from backend/capital keys to camelCase keys for derived/canonical fields
  let mappedKey = key;
  if (lKey === 'spend') mappedKey = 'spend';
  else if (lKey === 'revenue') mappedKey = 'rev';
  else if (lKey === 'sales') mappedKey = 'sales';
  else if (lKey === 'reported sale' || lKey === 'reportedsale') mappedKey = 'reportedSale';
  else if (lKey === 'roas') mappedKey = 'roas';
  else if (lKey === 'aov') mappedKey = 'aov';
  else if (lKey === 'gross margin %' || lKey === 'marginpct') mappedKey = 'marginPct';
  else if (lKey === 'leads') mappedKey = 'leads';
  else if (lKey === 'ctr %' || lKey === 'ctr') mappedKey = 'ctr';
  else if (lKey === 'avg_touches_per_order' || lKey === 'frequency') mappedKey = 'frequency';
  else if (lKey === 'impression' || lKey === 'impressions') mappedKey = 'impressions';
  else if (lKey === 'clicks') mappedKey = 'clicks';
  else if (lKey === 'atc') mappedKey = 'atc';
  else if (lKey === 'new visits' || lKey === 'newcust') mappedKey = 'newCust';
  
  if (mappedKey !== key && rowRecord[mappedKey] !== undefined) {
    const val = rowRecord[mappedKey];
    if (val === 'n/a' || val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  const cpm = row.cpm || (row as any).CPM || 2;
  const ctr = row.ctr || (row as any)["CTR %"] || 1;
  const spend = row.spend || (row as any).Spend || 0;
  const sales = row.sales || (row as any).Sales || 0;
  const aov = row.aov || (row as any).AOV || 0;
  const impressions = spend && cpm ? Math.round((spend / cpm) * 1000) : 0;
  const clicks      = Math.round(impressions * ctr / 100);
  const frequency   = row.frequency || (row as any).avg_touches_per_order || 2.2;
  const reach       = frequency ? Math.round(impressions / frequency) : 0;
  
  switch (lKey) {
    case "impression":
    case "impressions":   return impressions;
    case "clicks":        return clicks;
    case "reach":         return reach;
    case "videoviews":    return Math.round(impressions * 0.42);
    case "videop25":      return Math.round(impressions * 0.30);
    case "videop50":      return Math.round(impressions * 0.20);
    case "videop75":      return Math.round(impressions * 0.12);
    case "videop100":     return Math.round(impressions * 0.06);
    case "leads":         return Math.round((sales || 0) * 1.4);
    case "cpl":           return sales ? +((spend / (sales * 1.4)).toFixed(2)) : 0;
    case "atc":           return Math.round((sales || 0) * 4.6);
    case "checkout":      return Math.round((sales || 0) * 1.5);
    case "new visits":
    case "newcust":       return Math.round((sales || 0) * 0.68);
    case "returningcust": return (sales || 0) - Math.round((sales || 0) * 0.68);
    case "ltv":           return aov ? +(aov * 1.6).toFixed(2) : 0;
    case "trafficscore":  return Math.round(40 + (ctr || 0) * 25);
    case "marginpct":     return row.marginPct ?? (row as any)["Gross Margin %"] ?? 35;
    case "frequency":     return frequency;
    default:              return 0;
  }
}










// dummy data for action on repoting
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