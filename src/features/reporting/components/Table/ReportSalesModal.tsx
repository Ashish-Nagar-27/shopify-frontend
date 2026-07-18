import { useState, useEffect } from 'react';
import { useReportingTableSaleData } from '../../hooks/useReportingTableData';
import type { CampaignRow } from '@/lib/types';
import { ReportSalesDrawerHeader } from './ReportSalesDrawerHeader';
import { ReportSalesListPanel } from './ReportSalesListPanel';
import { ReportCustomerProfilePanel } from './ReportCustomerProfilePanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ReportSalesModalProps {
  open: boolean;
  onClose: () => void;
  row: CampaignRow | null;
  tab: string;
}

export function ReportSalesModal({ open, onClose, row, tab }: ReportSalesModalProps) {
  const [view, setView] = useState<'sales' | 'profile'>('sales');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'journey'>('profile');
  console.log('profileActiveTab ', profileActiveTab)
  console.log('selectedCustomerName ', selectedCustomerName)
  console.log('selectedTrackId ', selectedTrackId)
  console.log('view ', view)

  // Map source ('fb' | 'go' | 'tt') to channel string
  const getChannelName = (source: string | null | undefined): string => {
    if (!source) return 'Facebook';
    const s = source.toLowerCase();
    if (s.includes('fb') || s.includes('facebook')) return 'Facebook';
    if (s.includes('go') || s.includes('google')) return 'Google';
    if (s.includes('tt') || s.includes('tiktok')) return 'TikTok';
    return 'Facebook';
  };

  const channel = row ? getChannelName(row.source) : 'Facebook';
  const adid = row?.id || '';

  // Query table sale data hook for Level 1
  const { data: salesData, isLoading, isError, error } = useReportingTableSaleData(
    { adid, channel },
    open && !!adid
  );

  // Reset drawer states when closed
  useEffect(() => {
    if (!open) {
      setView('sales');
      setSelectedTrackId(null);
      setSelectedCustomerName(null);
      setProfileActiveTab('profile');
    }
  }, [open]);

  if (!open) return null;

  // Level 2 Transition: Customer Name Click (Open Profile tab)
  const handleCustomerClick = (trackId: string, name: string) => {
    setSelectedTrackId(trackId);
    setSelectedCustomerName(name);
    setProfileActiveTab('profile');
    setView('profile');
  };

  // Level 2 Transition: User Journey Click (Open Journey tab)
  const handleTrackIdClick = (trackId: string, name: string) => {
    setSelectedTrackId(trackId);
    setSelectedCustomerName(name);
    setProfileActiveTab('journey');
    setView('profile');
  };

  const handleNavigateToSales = () => {
    setView('sales');
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[oklch(0_0_0/0.5)] [backdrop-filter:blur(2px)] grid place-items-center p-6 [animation:modal-veil-in_0.18s_ease]"
      onClick={onClose}
    >

    <div
        className="
    fixed
    top-0
    right-0
    h-full
    w-[95vw]
    max-w-[1000px]
    bg-bg-deep
    border-l
    border-y
    border-border
    rounded-l-[16px]
    shadow-[-20px_0_60px_oklch(0_0_0/0.5)]
    overflow-hidden
    flex
    flex-col
    [animation:slide-in-right_0.2s_ease-out]
  "
        onClick={(e) => e.stopPropagation()}
      > 
  
        {/* Consolidated Header with Breadcrumbs */}
        <ReportSalesDrawerHeader
          tab={tab}
          row={row}
          view={view}
          customerName={selectedCustomerName}
          onClose={onClose}
          onNavigateToSales={handleNavigateToSales}
        />

        {/* Sliding Content Area */}
        <div className="flex-1 w-full overflow-hidden relative bg-bg-deep">
          <div
            className="flex w-[200%] h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${view === 'sales' ? '0%' : '-50%'})`,
            }}
          >    


            {/* Panel 1: Sales Details List (Level 1) */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-bg-deep">
              <ReportSalesListPanel
                isLoading={isLoading}
                isError={isError}
                error={error}
                salesData={salesData}
                onCustomerClick={handleCustomerClick}
                onTrackIdClick={handleTrackIdClick}
              />
            </div>

            {/* Panel 2: Customer Profile (Level 2) */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-bg-deep border-l border-border-soft">
          
              {selectedTrackId ? (
                <ReportCustomerProfilePanel
                  trackid={selectedTrackId}
                  activeTab={profileActiveTab}
                  setActiveTab={setProfileActiveTab}
                  selectedCustomerName={selectedCustomerName}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-fg-mute">
                  No customer selected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
