import * as XLSX from 'xlsx';
import type { CampaignRow, TabKey, ColumnDef } from '@/lib/types';
import { derived } from '@/lib/data';
import { fmt, fmtMoney } from '@/lib/utils';

// Helper to format values for Excel rows
function getFormattedValForExcel(val: number, key: string): any {
  const lKey = key.toLowerCase();
  if (lKey.includes('roas')) {
    return `${val.toFixed(2)}×`;
  }
  if (lKey.includes('%') || lKey.includes('pct') || lKey.includes('ctr') || lKey.includes('cr')) {
    return `${val.toFixed(2)}%`;
  }
  if (
    lKey === 'rev' ||
    lKey === 'revenue' ||
    lKey.includes('profit') ||
    lKey === 'cancelrev' ||
    lKey === 'rrevenue' ||
    lKey === 'nrevenue' ||
    lKey === 'reported rev'
  ) {
    return `₹${fmt(val)}`;
  }
  if (lKey === 'aov' || lKey === 'naov' || lKey === 'ltv') {
    return `₹${fmtMoney(val)}`;
  }
  if (
    lKey === 'spend' ||
    lKey === 'nspend' ||
    lKey === 'cost' ||
    lKey.includes('cpa') ||
    lKey.includes('cpc') ||
    lKey.includes('cpm') ||
    lKey.includes('cpl') ||
    lKey === 'ecpnv'
  ) {
    return fmtMoney(val);
  }
  if (lKey === 'frequency' || lKey === 'avg_touches_per_order' || lKey === 'total_touch_count') {
    return Number(val.toFixed(1));
  }
  return val;
}

export function exportReportToExcel({
  rows,
  tab,
  adaptedData,
  visibleCols,
  includeCampaignName = true,
  includeAdsetName = true,
  includeAdName = true,
  includeStatus = true,
}: {
  rows: CampaignRow[];
  tab: TabKey;
  adaptedData: {
    campaign: CampaignRow[];
    adset: CampaignRow[];
    ad: CampaignRow[];
  };
  visibleCols: ColumnDef[];
  includeCampaignName?: boolean;
  includeAdsetName: boolean;
  includeAdName: boolean;
  includeStatus: boolean;
}) {
  // Determine which level of data we should export based on user selection
  const exportLevel: TabKey = includeAdName
    ? 'ad'
    : includeAdsetName
    ? 'adset'
    : 'campaign';

  // 1. Gather all items to export, respecting parent filtering/sorting and parent hierarchy.
  let itemsToExport: CampaignRow[] = [];

  const campaignMap = new Map(adaptedData.campaign.map((c) => [c.id, c]));
  const adsetMap = new Map((adaptedData.adset || []).map((a) => [a.id, a]));

  if (tab === 'campaign') {
    if (exportLevel === 'campaign') {
      itemsToExport = rows;
    } else if (exportLevel === 'adset') {
      rows.forEach((camp) => {
        const matchingAdsets = (adaptedData.adset || []).filter((adset) => adset.parentId === camp.id);
        itemsToExport.push(...matchingAdsets);
      });
    } else if (exportLevel === 'ad') {
      rows.forEach((camp) => {
        const matchingAds = (adaptedData.ad || []).filter((ad) => ad.campaignId === camp.id);
        itemsToExport.push(...matchingAds);
      });
    }
  } else if (tab === 'adset') {
    if (exportLevel === 'campaign') {
      const campaignIds = Array.from(new Set(rows.map((r) => r.parentId).filter(Boolean)));
      itemsToExport = campaignIds.map((id) => campaignMap.get(id!)).filter(Boolean) as CampaignRow[];
    } else if (exportLevel === 'adset') {
      itemsToExport = rows;
    } else if (exportLevel === 'ad') {
      rows.forEach((adset) => {
        const matchingAds = (adaptedData.ad || []).filter((ad) => ad.parentId === adset.id);
        itemsToExport.push(...matchingAds);
      });
    }
  } else if (tab === 'ad') {
    if (exportLevel === 'campaign') {
      const campaignIds = Array.from(new Set(rows.map((r) => r.campaignId).filter(Boolean)));
      itemsToExport = campaignIds.map((id) => campaignMap.get(id!)).filter(Boolean) as CampaignRow[];
    } else if (exportLevel === 'adset') {
      const adsetIds = Array.from(new Set(rows.map((r) => r.parentId).filter(Boolean)));
      itemsToExport = adsetIds.map((id) => adsetMap.get(id!)).filter(Boolean) as CampaignRow[];
    } else if (exportLevel === 'ad') {
      itemsToExport = rows;
    }
  }

  // 2. Map items to excel rows
  // Columns: Campaign Name, Ad Set Name, Ad Name, Status, and then visibleCols
  const excelData = itemsToExport.map((item) => {
    const rowObj: Record<string, any> = {};

    // Get parent/item names based on exportLevel
    if (includeCampaignName) {
      let campaignName = '';
      if (exportLevel === 'campaign') {
        campaignName = item.name;
      } else if (exportLevel === 'adset') {
        const parentCampaign = campaignMap.get(item.parentId || '');
        campaignName = parentCampaign?.name || '';
      } else if (exportLevel === 'ad') {
        const parentCampaign = campaignMap.get(item.campaignId || '');
        campaignName = parentCampaign?.name || '';
      }
      rowObj['Campaign Name'] = campaignName;
    }

    if (includeAdsetName) {
      let adsetName = '';
      if (exportLevel === 'adset') {
        adsetName = item.name;
      } else if (exportLevel === 'ad') {
        const parentAdset = adsetMap.get(item.parentId || '');
        adsetName = parentAdset?.name || '';
      }
      rowObj['Ad Set Name'] = adsetName;
    }

    if (includeAdName) {
      if (exportLevel === 'ad') {
        rowObj['Ad Name'] = item.name;
      }
    }

    if (includeStatus) {
      rowObj['Status'] = item.status || '';
    }

    // Selected columns
    visibleCols.forEach((col) => {
      const val = derived(item, col.key);
      rowObj[col.label] = getFormattedValForExcel(val, col.key);
    });

    return rowObj;
  });

  console.log('excelData ', excelData);

  // 3. Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');

  // Adjust column widths automatically based on max cell length
  const maxLenMap: Record<string, number> = {};
  excelData.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const len = String(row[key] ?? '').length;
      maxLenMap[key] = Math.max(maxLenMap[key] || 10, len);
    });
  });
  worksheet['!cols'] = Object.keys(maxLenMap).map((key) => ({
    wch: Math.max(key.length, maxLenMap[key]) + 3,
  }));

  // 4. Download file
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Attribute_Report_${dateStr}.xlsx`);
}
