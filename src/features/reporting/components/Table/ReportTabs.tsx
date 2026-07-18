import { cn } from '@/lib/utils';
import * as Icon from '@/components/icons';
import type { TabKey } from '@/lib/types';

const TAB_DEFS = [
  { key: 'campaign', label: 'Campaign', icon: <Icon.campaign width="14" height="14" /> },
  { key: 'adset',    label: 'Ad set',   icon: <Icon.adset    width="14" height="14" /> },
  { key: 'ad',       label: 'Ad',       icon: <Icon.ad       width="14" height="14" /> },
] as const;

interface ReportTabsProps {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
  tabCounts: Record<TabKey, number>;
  rowsCount: number;
}

export function ReportTabs({
  tab,
  onTabChange,
  tabCounts,
  rowsCount,
}: ReportTabsProps) {
  return (
    <div className="flex items-stretch px-5 border-b border-border-soft">
      {TAB_DEFS.map((t) => (
        <div
          key={t.key}
          className={cn(
            'relative inline-flex items-center gap-[10px] px-5 py-4 pb-[14px] text-[13px] font-medium cursor-pointer transition-[color] duration-150 border-b-2 border-transparent mb-[-1px]',
            tab === t.key ? 'text-fg border-b-cyan' : 'text-fg-mute hover:text-fg-dim'
          )}
          onClick={() => onTabChange(t.key)}
        >
          <span className="w-[14px] h-[14px] opacity-90">{t.icon}</span>
          {t.label}
          <span
            className={cn(
              'text-[10px] font-mono font-semibold px-[6px] py-[2px] rounded-[4px]',
              tab === t.key ? 'text-cyan bg-cyan-soft' : 'bg-surface-2 text-fg-mute'
            )}
          >
            {tabCounts[t.key]}
          </span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className="inline-flex items-center px-5 text-fg-faint cursor-default">
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em' }}>
          Showing {rowsCount} of {tabCounts[tab]}
        </span>
      </div>
    </div>
  );
}
