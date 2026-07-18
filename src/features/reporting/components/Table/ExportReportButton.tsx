import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as Icon from '@/components/icons';
import { ExportReportModal } from './ExportReportModal';
import type { ColumnDef, CampaignRow, TabKey } from '@/lib/types';

const ctrlBase = 'inline-flex items-center gap-2 h-9 px-3 bg-surface border border-border-soft rounded-[10px] text-fg-dim text-[13px] transition-[border-color,color,background] duration-150 hover:border-border hover:text-fg';

interface ExportReportButtonProps {
  rows: CampaignRow[];
  tab: TabKey;
  adaptedData: {
    campaign: CampaignRow[];
    adset: CampaignRow[];
    ad: CampaignRow[];
  };
  visibleCols: ColumnDef[];
}

export function ExportReportButton({
  rows,
  tab,
  adaptedData,
  visibleCols,
}: ExportReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={cn(ctrlBase, 'w-9 px-0 justify-center cursor-pointer')}
        title="Export"
        onClick={() => setOpen(true)}
      >
        <Icon.download width="14" height="14" />
      </button>

      <ExportReportModal
        open={open}
        onClose={() => setOpen(false)}
        rows={rows}
        tab={tab}
        adaptedData={adaptedData}
        visibleCols={visibleCols}
      />
    </>
  );
}
