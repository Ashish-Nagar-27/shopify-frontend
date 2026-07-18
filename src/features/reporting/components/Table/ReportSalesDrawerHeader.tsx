import type { CampaignRow } from '@/lib/types';

interface ReportSalesDrawerHeaderProps {
  tab: string;
  row: CampaignRow | null;
  view: 'sales' | 'profile';
  customerName: string | null;
  onClose: () => void;
  onNavigateToSales: () => void;
}

export function ReportSalesDrawerHeader({
  tab,
  row,
  view,
  customerName,
  onClose,
  onNavigateToSales,
}: ReportSalesDrawerHeaderProps) {
  
  const getTabLabel = (t: string): string => {
    const lower = (t || '').toLowerCase();
    if (lower === 'campaign') return 'Campaign';
    if (lower === 'adset') return 'Ad Set';
    if (lower === 'ad') return 'Ad';
    return 'Campaign';
  };

  const tabLabel = getTabLabel(tab);

  return (
    <div className="relative flex items-center justify-between px-6 py-4 border-b border-border-soft bg-[linear-gradient(180deg,oklch(0.18_0.02_235),var(--bg-deep))] select-none">
      <div className="flex items-center gap-2">
        {/* Back Button (Only visible on Customer Profile Level 2) */}
        {view === 'profile' && (
          <button
            onClick={onNavigateToSales}
            className="p-1.5 -ml-1 rounded-[7px] text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms] flex items-center justify-center"
            title="Back to Sales Details"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-fg-mute overflow-hidden text-ellipsis whitespace-nowrap">
          {/* Level 1: Tab Root */}
          <button
            onClick={onClose}
            className="hover:text-fg hover:underline transition-colors shrink-0"
          >
            {tabLabel}
          </button>

          <span className="text-fg-faint font-normal shrink-0">/</span>

          {/* Level 2: Ad Set Name */}
          <button
            onClick={onClose}
            className="hover:text-fg hover:underline transition-colors max-w-[180px] truncate shrink-0"
            title={row?.name || ''}
          >
            {row?.name || 'Details'}
          </button>

          <span className="text-fg-faint font-normal shrink-0">/</span>

          {/* Level 3: Sales Details */}
          {view === 'profile' ? (
            <>
              <button
                onClick={onNavigateToSales}
                className="hover:text-fg hover:underline transition-colors text-fg-mute shrink-0"
              >
                Sales Details
              </button>
              
              <span className="text-fg-faint font-normal shrink-0">/</span>

              {/* Level 4: Customer Profile Name */}
              <span className="text-cyan font-semibold truncate max-w-[150px] shrink-0" title={customerName || ''}>
                {customerName || 'Profile'}
              </span>
            </>
          ) : (
            <span className="text-cyan font-semibold shrink-0">Sales Details</span>
          )}
        </div>
      </div>

      {/* Close Drawer Button */}

      {/* <button
        className=" w-[30px] h-[30px] rounded-[7px] grid place-items-center text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms] shrink-0"
        onClick={onClose}
        title="Close Drawer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentcolor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
      </button> */}

      <button
        className="fixed right-4 top-[12px] w-[30px] font-bold h-[30px] rounded-[7px] grid place-items-center text-fg-mute hover:bg-surface hover:text-fg transition-[background,color] duration-[120ms] shrink-0"
        onClick={onClose}
        title="Close Drawer"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
      </button>
    </div>
  );
}
