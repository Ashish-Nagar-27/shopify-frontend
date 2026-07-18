import { useReportingCustomerProfile, useReportingTableSaleJourney } from '../../hooks/useReportingTableData';
import { cn, fmtMoney } from '@/lib/utils';
import * as Icon from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ReportCustomerProfilePanelProps {
  trackid: string;
  activeTab: 'profile' | 'journey';
  setActiveTab: (tab: 'profile' | 'journey') => void;
  selectedCustomerName: string | null;
}

export function ReportCustomerProfilePanel({
  trackid,
  activeTab,
  setActiveTab,
  selectedCustomerName
}: ReportCustomerProfilePanelProps) {
  
  // Queries
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useReportingCustomerProfile(trackid, !!trackid);

  const {
    data: journeyData,
    isLoading: isJourneyLoading,
    isError: isJourneyError,
    error: journeyError,
  } = useReportingTableSaleJourney(trackid, !!trackid);

  // Parse fields
  const profile = profileData?.data?.profile || profileData?.profile;
  const kpis = profileData?.data?.kpis || profileData?.kpis;
  const orders = profileData?.data?.orders || profileData?.orders || [];
  const journey = profileData?.data?.journey || profileData?.journey;

  // Generate initials for avatar
  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'C';
    return nameStr.trim().charAt(0).toUpperCase();
  };

  // Get status badge for orders list
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed' || s === 'success' || s === 'paid') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-pos-soft border border-pos/25 text-pos select-none">
          {status}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-surface-2 border border-border-soft text-fg-dim select-none">
        {status}
      </span>
    );
  };

  // Renders social logos for the journey checkpoints timeline
  const renderSourceIcon = (source: string | null | undefined) => {
    const s = (source || '').toLowerCase();
    const isFb = s.includes('facebook') || s.includes('fb');
    const isGo = s.includes('google') || s.includes('go');

    if (isFb) {
      return (
        <div className="w-[38px] h-[38px] rounded-[10px] border border-blue-500/20 bg-blue-500/5 flex items-center justify-center flex-shrink-0 z-10 shadow-sm select-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      );
    }

    if (isGo) {
      return (
        <div className="w-[38px] h-[38px] rounded-[10px] border border-red-500/20 bg-red-500/5 flex items-center justify-center flex-shrink-0 z-10 shadow-sm select-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </div>
      );
    }

    return (
      <div className="w-[38px] h-[38px] rounded-[10px] border border-border-soft bg-surface flex items-center justify-center flex-shrink-0 z-10 shadow-sm select-none">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg-mute)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Top Section - Avatar & Name */}
      <div className="flex gap-4 flex-row">

        {isProfileLoading ? (
          <div className="w-14 h-14 rounded-full bg-surface animate-pulse" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-cyan/10 border border-cyan/35 text-cyan flex items-center justify-center font-bold text-xl uppercase tracking-wider select-none font-sans">
            {getInitials(profile?.name || selectedCustomerName)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {isProfileLoading ? (
            <div className="space-y-2">
              {/* <div className="h-5 bg-surface rounded w-1/3 animate-pulse" /> */}
              <h3 className="text-[20px] font-bold text-fg leading-tight">
                {selectedCustomerName || 'Anonymous'}
              </h3>
              <div className="h-3 bg-surface rounded w-1/4 animate-pulse" />
            </div>
          ) : isProfileError ? (
            <div>
              <h3 className="text-[20px] font-bold text-fg leading-tight">
                {selectedCustomerName || 'Anonymous'}
              </h3>
              <p className="text-[12px] text-fg-mute mt-1.5">
                Error loading profile details
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-[20px] font-bold text-fg leading-tight truncate" title={profile?.name}>
                {profile?.name || 'Anonymous'}
              </h3>
              <p className="text-[12px] text-fg-mute font-mono mt-1.5">
                Customer since: {profile?.customerSince || '—'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-soft gap-6 select-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'pb-3 text-[14px] font-medium transition-all relative focus:outline-none',
            activeTab === 'profile' ? 'text-cyan font-semibold' : 'text-fg-mute hover:text-fg'
          )}
        >
          Overview & Orders
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('journey')}
          className={cn(
            'pb-3 text-[14px] font-medium transition-all relative focus:outline-none',
            activeTab === 'journey' ? 'text-cyan font-semibold' : 'text-fg-mute hover:text-fg'
          )}
        >
          User Journey Timeline
          {activeTab === 'journey' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'profile' ? (
        <div className="space-y-6 animate-[fade-in_0.15s_ease-out]">
          {isProfileLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 h-20 bg-surface rounded-[10px] animate-pulse" />
              <div className="grid grid-cols-2 gap-4 h-32 bg-surface rounded-[10px] animate-pulse" />
              <div className="h-40 bg-surface rounded-[10px] animate-pulse" />
            </div>
          ) : isProfileError ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-12 h-12 rounded-full bg-red-soft/20 border border-red-soft flex items-center justify-center text-red-500 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-fg font-medium">Failed to load customer profile</h3>
              <p className="text-fg-mute text-[13px] mt-1">
                {profileError instanceof Error ? profileError.message : 'An error occurred.'}
              </p>
            </div>
          ) : (!profileData || (!profile && !kpis)) ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-fg-faint mb-3">
                <Icon.user width="24" height="24" />
              </div>
              <h3 className="text-fg font-medium">No profile data found</h3>
            </div>
          ) : (
            <>
              {/* Contact Details Card */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-bg-overlay border border-border-soft rounded-[10px] shadow-sm">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                    EMAIL
                  </span>
                  <span className="text-[13px] text-fg-dim font-medium block mt-0.5 break-all">
                    {profile?.email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                    PHONE
                  </span>
                  <span className="text-[13px] text-fg-dim font-medium block mt-0.5">
                    {profile?.phone || '—'}
                  </span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div>
                <h4 className="text-[11px] font-semibold text-fg-mute uppercase tracking-wider mb-3">
                  Key Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* LTV */}
                  <div className="bg-bg-overlay border border-border-soft p-4 rounded-[10px] flex flex-col justify-between shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-fg-faint tracking-wider">
                      LTV
                    </span>
                    <span className="text-[16px] font-bold text-fg font-mono mt-1 tabular-nums">
                      ₹{fmtMoney(kpis?.ltv)}
                    </span>
                  </div>
                  {/* Total Orders */}
                  <div className="bg-bg-overlay border border-border-soft p-4 rounded-[10px] flex flex-col justify-between shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-fg-faint tracking-wider">
                      Total Orders
                    </span>
                    <span className="text-[16px] font-bold text-fg font-mono mt-1 tabular-nums">
                      {kpis?.totalOrders || 0}
                    </span>
                  </div>
                  {/* AOV */}
                  <div className="bg-bg-overlay border border-border-soft p-4 rounded-[10px] flex flex-col justify-between shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-fg-faint tracking-wider">
                      Average Order Value
                    </span>
                    <span className="text-[16px] font-bold text-fg font-mono mt-1 tabular-nums">
                      ₹{fmtMoney(kpis?.averageOrderValue)}
                    </span>
                  </div>
                  {/* Purchase Frequency */}
                  <div className="bg-bg-overlay border border-border-soft p-4 rounded-[10px] flex flex-col justify-between shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-fg-faint tracking-wider">
                      Purchase Frequency
                    </span>
                    <span className="text-[16px] font-bold text-fg font-mono mt-1">
                      {kpis?.avgPurchaseFrequency || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History Table */}
              <div>
                <h4 className="text-[11px] font-semibold text-fg-mute uppercase tracking-wider mb-3">
                  Order History
                </h4>
                {orders.length === 0 ? (
                  <div className="border border-border-soft rounded-[8px] p-6 bg-bg-overlay text-center text-fg-mute text-[12px]">
                    No orders recorded for this customer.
                  </div>
                ) : (
                  <div className="border border-border-soft rounded-[8px] bg-bg-overlay overflow-hidden">
                    <table className="w-full border-collapse text-left text-[12px]">
                      <thead>
                        <tr className="bg-surface border-b border-border-soft text-fg-dim font-medium">
                          <th className="px-4 py-2.5 font-sans">Order ID</th>
                          <th className="px-4 py-2.5 font-sans">Date</th>
                          <th className="px-4 py-2.5 font-sans text-right">Amount</th>
                          <th className="px-4 py-2.5 font-sans">Channel</th>
                          <th className="px-4 py-2.5 font-sans">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft/40">
                        {orders.map((order: any, idx: number) => (
                          <tr key={idx} className="hover:bg-surface-2/20">
                            <td className="px-4 py-2.5 text-fg font-mono text-[11px]">{order?.orderId || '—'}</td>
                            <td className="px-4 py-2.5 text-fg-dim font-mono">{order?.date || '—'}</td>
                            <td className="px-4 py-2.5 text-right text-fg font-mono tabular-nums">
                              ₹{fmtMoney(order?.amount)}
                            </td>
                            <td className="px-4 py-2.5 text-fg-dim">{order?.channel || '—'}</td>
                            <td className="px-4 py-2.5">{getStatusBadge(order?.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Customer Journey & Attribution Summary */}
              <div>
                <h4 className="text-[11px] font-semibold text-fg-mute uppercase tracking-wider mb-3">
                  Attribution Summary
                </h4>
                <div className="bg-bg-overlay border border-border-soft rounded-[10px] p-4 space-y-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 divide-x divide-border-soft/40">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                        First Touch Attribution
                      </span>
                      <span className="text-[13px] text-cyan font-semibold block mt-1 uppercase tracking-wide">
                        {journey?.firstTouch?.channel || '—'}
                      </span>
                      <span className="text-[11px] text-fg-mute font-mono block mt-0.5">
                        {journey?.firstTouch?.date || '—'}
                      </span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                        Last Touch Attribution
                      </span>
                      <span className="text-[13px] text-cyan font-semibold block mt-1 uppercase tracking-wide">
                        {journey?.lastTouch?.channel || '—'}
                      </span>
                      <span className="text-[11px] text-fg-mute font-mono block mt-0.5">
                        {journey?.lastTouch?.date || '—'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border-soft/40 flex items-center justify-between text-[12px]">
                    <span className="text-fg-mute">Total Touchpoints</span>
                    <span className="text-fg font-medium font-mono">
                      {journey?.touchpoints?.total || 0} ({journey?.touchpoints?.description || 'Across all channels'})
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-[fade-in_0.15s_ease-out]">
          {isJourneyLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-[38px] h-[38px] rounded-[10px] bg-surface animate-pulse" />
                  <div className="flex-1 h-28 bg-surface rounded-[12px] animate-pulse" />
                </div>
              ))}
            </div>
          ) : isJourneyError ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-12 h-12 rounded-full bg-red-soft/20 border border-red-soft flex items-center justify-center text-red-500 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-fg font-medium">Failed to load journey</h3>
              <p className="text-fg-mute text-[13px] mt-1">
                {journeyError instanceof Error ? journeyError.message : 'An error occurred.'}
              </p>
            </div>
          ) : !journeyData || journeyData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-fg-faint mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-fg font-medium">No journey checkpoints found</h3>
              <p className="text-fg-mute text-[13px] mt-1">
                We couldn't retrieve any ad touchpoints associated with this customer journey.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 relative pl-2">
              {journeyData?.map((item: any, idx: number) => {
                const parts = (item?.event_time || '').split(' ');
                const datePart = parts[0] || '—';
                const timePart = parts[1] || '—';
                const isLast = idx === journeyData.length - 1;

                return (
                  <div key={idx} className="flex gap-5 items-start relative">
                    {/* Left node with vertical connector line */}
                    <div className="flex flex-col items-center flex-shrink-0 relative">
                      {renderSourceIcon(item?.adsource)}
                      {!isLast && (
                        <div className="w-[2px] bg-warn/30 absolute top-[38px] bottom-[-24px] left-[18px] z-0" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-bg-overlay border border-border-soft rounded-[12px] p-5 flex justify-between items-start gap-4 shadow-sm hover:border-border transition-[border-color] duration-150">
                      {/* Left side: Date / Time */}
                      <div className="flex flex-col text-left">
                        <span className="text-[15px] font-bold text-fg leading-tight">
                          {datePart}
                        </span>
                        <span className="text-[12px] text-fg-mute font-mono mt-1">
                          {timePart}
                        </span>
                      </div>

                      {/* Right side: Source / Ad Info */}
                      <div className="flex flex-col text-right">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                            SOURCE
                          </span>
                          <span className="text-[13px] text-fg-dim font-medium block mt-0.5">
                            {item?.adsource}
                          </span>
                        </div>
                        <div className="mt-3">
                          <span className="text-[9px] uppercase tracking-wider text-fg-faint font-semibold block">
                            AD
                          </span>
                          <span className="text-[14px] text-cyan font-semibold block mt-0.5">
                            {item?.adname}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
