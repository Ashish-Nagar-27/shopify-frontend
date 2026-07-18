import type { CampaignRow } from '@/lib/types';

/**
 * Safely parses any value to a number.
 * Returns 0 if null, undefined, 'n/a', or invalid.
 */
function parseNum(val: any): number {
  if (val === null || val === undefined || val === 'n/a') return 0;
  if (typeof val === 'number') return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Maps source text to valid SourceKey.
 */
function mapSource(src: string | null | undefined): 'fb' | 'go' | 'tt' {
  if (!src) return 'fb';
  const key = src.toLowerCase();
  if (key.includes('facebook') || key.includes('fb')) return 'fb';
  if (key.includes('google') || key.includes('go')) return 'go';
  if (key.includes('tiktok') || key.includes('tt')) return 'tt';
  return 'fb';
}

/**
 * Maps status text to valid status key.
 */
function mapStatus(st: string | null | undefined): 'active' | 'paused' | 'off' {
  if (!st) return 'active';
  const key = st.toLowerCase();
  if (key === 'active') return 'active';
  if (key === 'pause' || key === 'paused') return 'paused';
  return 'off';
}

/**
 * Maps a single row object from the backend/mock to CampaignRow.
 */
function mapBaseRow(
  item: any,
  id: string,
  name: string,
  status: string,
  source: string,
  parentId?: string,
  campaignId?: string
): CampaignRow {
  const sales = parseNum(item.Sales);
  const newCust = parseNum(item["New Visits"]);
  const returningCust = Math.max(0, sales - newCust);

  return {
    ...item,
    id,
    name,
    status: mapStatus(status),
    source: mapSource(source),
    parentId,
    campaignId,
    spend: parseNum(item.Spend),
    rev: parseNum(item.Revenue),
    sales,
    reportedSale: parseNum(item.ReportedSale !== undefined ? item.ReportedSale : item["Reported Sale"]),
    roas: parseNum(item.ROAS),
    cpa: parseNum(item.CPA),
    aov: parseNum(item.AOV),
    cpm: parseNum(item.CPM),
    cpc: parseNum(item.CPC),
    cpl: parseNum(item.CPL),
    ctr: parseNum(item.CTR !== undefined ? item.CTR : item["CTR %"]),
    frequency: parseNum(item.avg_touches_per_order || item.frequency),
    marginPct: parseNum(item["Gross Margin %"] || item.marginPct),
    impressions: parseNum(item.Impression !== undefined ? item.Impression : item.Impressions),
    clicks: parseNum(item.Clicks),
    leads: parseNum(item.Leads),
    atc: parseNum(item.ATC),
    newCust,
    returningCust,
  } as unknown as CampaignRow;
}

/**
 * Adapts nested backend campaign report data to CampaignRow lists for campaigns, adsets, and ads.
 */
export function adaptBackendData(backendData: any): {
  campaign: CampaignRow[];
  adset: CampaignRow[];
  ad: CampaignRow[];
} {
  const campaigns: CampaignRow[] = [];
  const adsets: CampaignRow[] = [];
  const ads: CampaignRow[] = [];

  const rawCampaigns = backendData?.campaign || [];

  rawCampaigns.forEach((camp: any) => {
    const campaignId = camp.campaign_id;
    const campaignName = camp.campaign_name;
    const campaignStatus = camp.campaign_status;
    const campaignSource = camp.source || 'Facebook';

    // Map adsets
    const mappedAdSets: CampaignRow[] = [];
    const rawAdSets = camp.ad_sets || [];

    rawAdSets.forEach((adset: any) => {
      const adsetId = adset.ad_set_id;
      const adsetName = adset.ad_set_name;
      const adsetStatus = adset.ad_set_status;
      const adsetSource = adset.source || campaignSource;

      // Map ads
      const mappedAds: CampaignRow[] = [];
      const rawAds = adset.ads || [];

      rawAds.forEach((ad: any) => {
        const adId = ad.ad_id;
        const adName = ad.ad_name;
        const adStatus = ad.ad_status;
        const adSource = ad.source || adsetSource;

        const adRow = mapBaseRow(
          ad,
          adId,
          adName,
          adStatus,
          adSource,
          adsetId,
          campaignId
        );

        mappedAds.push(adRow);
        ads.push(adRow);
      });

      const adsetRow = mapBaseRow(
        adset,
        adsetId,
        adsetName,
        adsetStatus,
        adsetSource,
        campaignId
      );
      adsetRow.children = mappedAds; // Support nested ads selection/expansion

      mappedAdSets.push(adsetRow);
      adsets.push(adsetRow);
    });

    const campaignRow = mapBaseRow(
      camp,
      campaignId,
      campaignName,
      campaignStatus,
      campaignSource
    );
    campaignRow.children = mappedAdSets; // Support nested adsets expansion

    campaigns.push(campaignRow);
  });

  return {
    campaign: campaigns,
    adset: adsets,
    ad: ads,
  };
}
