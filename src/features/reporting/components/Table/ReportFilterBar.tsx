import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as Icon from '@/components/icons';
import type { TabKey } from '@/lib/types';
import { useReportingTableData } from '../../hooks/useReportingTableData';
import { useReportingStore } from '@/store/useReportingStore';

interface ReportFilterBarProps {
  tab: TabKey;
  search: string;
  onSearchChange: (search: string) => void;
}

interface FilterDropdownOption {
  value: string;
  label: string;
  badge?: React.ReactNode;
}

interface FilterDropdownProps {
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  renderTrigger: (currentOption: FilterDropdownOption | undefined) => React.ReactNode;
}

function FilterDropdown({ value, options, onChange, renderTrigger }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>
        {renderTrigger(current)}
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-[50] min-w-[160px] max-h-[280px] overflow-y-auto bg-bg-deep border border-border rounded-[9px] shadow-[0_18px_40px_-12px_oklch(0_0_0/0.7)] p-[5px] flex flex-col gap-1">
          {options.map(o => (
            <button
              key={o.value}
              className={cn(
                'flex items-center gap-2 px-[10px] py-[8px] rounded-[6px] text-left text-fg-dim transition-[background,color] duration-[120ms] hover:bg-surface hover:text-fg text-[13px] font-medium w-full cursor-pointer',
                o.value === value && 'bg-cyan-soft text-cyan',
              )}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.badge}
              <span className="flex-1 truncate">{o.label}</span>
              {o.value === value && (
                <svg className="ml-auto flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5 9-11"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReportFilterBar({
  tab,
  search,
  onSearchChange,
}: ReportFilterBarProps) {
  const { sourceData, adsAccountsData } = useReportingTableData();
  const { traffic, account, setTraffic, setAccount } = useReportingStore();

  const getSearchPlaceholder = () => {
    switch (tab) {
      case 'campaign':
        return 'Search campaigns…';
      case 'adset':
        return 'Search ad sets…';
      case 'ad':
        return 'Search ads…';
      default:
        return 'Search…';
    }
  };

  const getSourceBadge = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    if (name.includes('facebook') || name.includes('meta')) {
      return <span className="w-[14px] h-[14px] rounded-[3px] bg-[linear-gradient(135deg,#1877F2,#0a4fb0)] flex-shrink-0" />;
    }
    if (name.includes('google')) {
      return <span className="w-[14px] h-[14px] rounded-[3px] bg-[linear-gradient(135deg,#ea4335,#fbbc04_50%,#34a853)] flex-shrink-0" />;
    }
    if (name.includes('linkedin')) {
      return <span className="w-[14px] h-[14px] rounded-[3px] bg-[linear-gradient(135deg,#0077B5,#005987)] flex-shrink-0" />;
    }
    return <span className="w-[14px] h-[14px] rounded-[3px] bg-fg-mute opacity-40 flex-shrink-0" />;
  };

  const formatSourceLabel = (str: string) => {
    const trimmed = str.trim();
    const upper = trimmed.toUpperCase();
    if (['GPAY', 'CRED', 'HIKE', 'ZOKO'].includes(upper)) {
      return upper;
    }
    return trimmed
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const baseSources = ['Facebook', 'Google', 'LinkedIn'];
  const channelList = sourceData?.channels || [];

  const sourceOptions: FilterDropdownOption[] = [
    ...baseSources.map(s => ({
      value: s,
      label: s,
      badge: getSourceBadge(s)
    })),
    ...channelList
      .filter((c: string) => !baseSources.some(b => b.toLowerCase() === c.toLowerCase()))
      .map((c: string) => ({
        value: c,
        label: formatSourceLabel(c),
        badge: getSourceBadge(c)
      }))
  ];

  const getAccountsForSelectedSource = () => {
    if (!adsAccountsData) return [];
    const lowerSource = traffic.toLowerCase();
    if (lowerSource.includes('facebook')) {
      return adsAccountsData.facebook || [];
    }
    if (lowerSource.includes('google')) {
      return adsAccountsData.google || [];
    }
    if (lowerSource.includes('linkedin')) {
      return adsAccountsData.linkedin || [];
    }
    return [];
  };

  const accountsForSource = getAccountsForSelectedSource();
  const accountOptions: FilterDropdownOption[] = [
    { value: 'All', label: 'All accounts' },
    ...accountsForSource.map((acc: { account: string; account_name: string }) => ({
      value: acc.account,
      label: acc.account_name,
    }))
  ];

  return (
    <div className="flex items-center gap-3 px-5 py-[14px] flex-wrap">
      <div className="inline-flex items-center gap-2 flex-1 min-w-[200px] max-w-[360px] h-9 px-3 bg-bg-deep border border-border-soft rounded-[9px]">
        <Icon.search width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
        <input
          className="flex-1 border-none outline-none bg-transparent text-[13px] text-fg placeholder:text-fg-faint"
          placeholder={getSearchPlaceholder()}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="inline-flex items-center gap-2 ml-auto">
        <span className="text-[11px] text-fg-mute uppercase tracking-[0.08em] font-semibold">Account</span>
        <FilterDropdown
          value={account}
          options={accountOptions}
          onChange={(v) => setAccount(v)}
          renderTrigger={(current) => (
            <button className="inline-flex items-center gap-2 h-9 px-[10px] pl-3 bg-bg-deep border border-border-soft rounded-[9px] text-[13px] text-fg min-w-[110px] hover:border-border transition-[border-color] duration-[120ms] cursor-pointer">
              <span>{current?.label || 'All accounts'}</span>
              <Icon.chevronDown className="text-fg-mute ml-auto" width="12" height="12" />
            </button>
          )}
        />
        <span className="text-[11px] text-fg-mute uppercase tracking-[0.08em] font-semibold ml-2">Source</span>
        <FilterDropdown
          value={traffic}
          options={sourceOptions}
          onChange={(newSource) => {
            setTraffic(newSource);
            setAccount('All');
          }}
          renderTrigger={(current) => (
            <button className="inline-flex items-center gap-2 h-9 px-[10px] pl-3 bg-bg-deep border border-border-soft rounded-[9px] text-[13px] text-fg min-w-[110px] hover:border-border transition-[border-color] duration-[120ms] cursor-pointer">
              {current?.badge}
              <span>{current?.label || traffic}</span>
              <Icon.chevronDown className="text-fg-mute ml-auto" width="12" height="12" />
            </button>
          )}
        />
      </div>
    </div>
  );
}
