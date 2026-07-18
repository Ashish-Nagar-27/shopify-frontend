import { fmtMoney } from '@/lib/utils';

interface ReportSalesListPanelProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  salesData: any[] | null;
  onCustomerClick: (trackId: string, name: string) => void;
  onTrackIdClick: (trackId: string, name: string) => void;
}

export function ReportSalesListPanel({
  isLoading,
  isError,
  error,
  salesData,
  onCustomerClick,
  onTrackIdClick,
}: ReportSalesListPanelProps) {
  
  const formatOrderDate = (dateStr: string): string => {
    if (!dateStr) return '—';
    try {
      const isoStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 ">
        {/* Table skeleton header */}
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.2fr_1.2fr] gap-4 pb-2 border-b border-border-soft">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-surface rounded animate-pulse" />
          ))}
        </div>
        {/* Table skeleton rows */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1.2fr_1.2fr] gap-4 py-3 border-b border-border-soft/50">
            <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
            <div className="h-4 bg-surface rounded animate-pulse w-5/6" />
            <div className="h-4 bg-surface rounded animate-pulse w-1/2" />
            <div className="h-4 bg-surface rounded animate-pulse w-2/3" />
            <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <div className="w-12 h-12 rounded-full bg-red-soft/20 border border-red-soft flex items-center justify-center text-red-500 mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-fg font-medium">Failed to load sales data</h3>
        <p className="text-fg-mute text-[13px] mt-1 max-w-[320px]">
          {error instanceof Error ? error.message : 'An unexpected error occurred while fetching details.'}
        </p>
      </div>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-fg-faint mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
        </div>
        <h3 className="text-fg font-medium">No sales recorded</h3>
        <p className="text-fg-mute text-[13px] mt-1">
          There are no detailed customer sales records for this ad entity.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border-soft rounded-[8px] bg-bg-overlay overflow-hidden">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="bg-surface border-b border-border-soft text-fg-dim font-medium">
            <th className="px-5 py-3 font-sans w-[160px]">Name</th>
            <th className="px-5 py-3 font-sans">Email/Phone</th>
            <th className="px-5 py-3 font-sans text-right">Amount</th>
            <th className="px-5 py-3 font-sans">Received At</th>
            <th className="px-5 py-3 font-sans">User Journey</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft/50">
          {salesData?.map((sale: any, idx: number) => {
            const customerName = sale?.complete_name || 'Customer';
            const trackId = sale?.trackid || '';
            
            return (
              <tr
                key={idx}
                className="hover:bg-surface-2/40 transition-[background] duration-150"
              >
                {/* Clickable Customer Name */}
                <td className="px-5 py-3 text-fg font-medium max-w-[160px] truncate" title={`Open ${customerName}'s Profile`}>
                  {sale?.complete_name ? (
                    <button
                      onClick={() => onCustomerClick(trackId, customerName)}
                      className="text-cyan text-left underline decoration-dotted underline-offset-[3px] hover:text-cyan-hover font-medium cursor-pointer focus:outline-none"
                    >
                      {customerName}
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
                
                <td className="px-5 py-3 text-fg-dim font-mono text-[12px]">{sale?.email_phone || '—'}</td>
                
                <td className="px-5 py-3 text-right text-fg font-mono font-medium tabular-nums">
                  {fmtMoney(sale?.total)}
                </td>
                
                <td className="px-5 py-3 text-fg-dim font-mono text-[12px]">
                  {formatOrderDate(sale?.order_date)}
                </td>
                
                {/* Clickable Journey Track ID */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {sale?.trackid ? (
                      <button
                        onClick={() => onTrackIdClick(trackId, customerName)}
                        className="text-cyan underline decoration-dotted underline-offset-[3px] hover:text-cyan-hover cursor-pointer font-mono font-medium text-[12px] focus:outline-none"
                        title={`Open ${customerName}'s Journey`}
                      >
                        {trackId}
                      </button>
                    ) : (
                      '—'
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
