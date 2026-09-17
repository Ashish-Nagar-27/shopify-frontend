

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MONTHS, fmtDate, cn } from '@/lib/utils';
import type { DateRange } from './CalendarPopover';
import * as Icon from '@/components/icons';
import { CalendarPopover } from './CalendarPopover';
import { useAuthStore } from "@/store/useAuthStore";
import { useDateStore} from "@/store/useDateStore";
import { NAV_ITEMS } from "@/constants/navigation";
import useApiDataRefresh from "@/hooks/useApiDataRefresh";

const ctrlBase = 'inline-flex items-center justify-center gap-2 h-9 bg-surface border border-border-soft rounded-[10px] text-fg-dim text-[13px] transition-[border-color,color,background] duration-150 hover:border-border hover:text-fg';

export default function TopBar({
  showDatePicker=true,
}: {
  showDatePicker?: boolean;
}) {
  

  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const store = useDateStore();
  const [calOpen, setCalOpen] = useState(false);
  const todayRef = useRef(new Date());
  todayRef.current.setHours(0, 0, 0, 0);
  const today = todayRef.current;

  const pageData = NAV_ITEMS.find((item) => 
    item.href === pathname || 
    (item.href !== "/" && pathname.startsWith(item.href)) ||
    (item.href === "/settings" && pathname.startsWith("/settings"))
  );
  const dateKey = pageData?.dateKey
 
  const currentDates = dateKey ? store[dateKey] : store['dashboardDates']
  const startDateStr = currentDates?.[0];
  const endDateStr = currentDates?.[1];



  const parseDateStr = (str: string | undefined, defaultDate: Date) => {
    if (!str) return defaultDate;
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? defaultDate : parsed;
  };

  const range: DateRange = {
    start: parseDateStr(startDateStr, new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)),
    end: parseDateStr(endDateStr, today),
  };

  const sameMonth =
    range.start.getMonth() === range.end.getMonth() &&
    range.start.getFullYear() === range.end.getFullYear();

  const label = sameMonth
    ? `${String(range.start.getDate()).padStart(2, '0')} — ${String(range.end.getDate()).padStart(2, '0')} ${MONTHS[range.end.getMonth()].slice(0, 3)} ${range.end.getFullYear()}`
    : `${fmtDate(range.start)} — ${fmtDate(range.end)}`;

  // User initials for the avatar
  const userName = user?.adminid ? user.adminid.split('@')[0] : "User";
  const initials = userName
    .split(/[._-]/)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);


    //  refresh button 
  const { refreshPageData } = useApiDataRefresh();

  return (
    <header className="flex items-center justify-between px-7 py-[18px] gap-6 border-b border-border-soft bg-[linear-gradient(180deg,oklch(0.16_0.02_235/0.9),oklch(0.16_0.02_235/0.4))] [backdrop-filter:blur(8px)] sticky top-0 z-[4]">
      <div className="flex items-center gap-[14px]">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] m-0">{pageData?.headerTitle}</h1>


        {/* profile dropdown section */}
        {/* <span className="text-fg-faint font-light">/</span> */}
        {/* <button
          className="flex items-center gap-[10px] py-[7px] pr-3 pl-2 bg-surface border border-border-soft rounded-full text-[13px] text-fg-dim transition-[border-color] duration-150 hover:border-border"
          title="Switch account">
          <span className="w-6 h-6 rounded-full bg-[linear-gradient(135deg,var(--magenta),var(--cyan))] grid place-items-center text-[oklch(0.10_0.018_240)] font-bold text-[11px]">
            R
          </span>
          <span>Ravi · Pumalyze Demo</span>
          <Icon.chevronDown width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
        </button> */}

      </div>

      <div className="flex items-center gap-[10px]">
        {showDatePicker && dateKey && <div style={{ position: 'relative' }}>
          <button
            className={cn(
              'inline-flex items-center gap-[10px] h-9 px-3 bg-surface border border-border-soft rounded-[10px] font-mono text-[12px] text-fg-dim cursor-pointer transition-[border-color] duration-150 hover:border-cyan-deep',
              calOpen && 'border-cyan-deep',
            )}
            onClick={() => setCalOpen(o => !o)}>
            <Icon.calendar width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
            <span>{label}</span>
            <span className="w-[6px] h-[6px] rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
            <span style={{ color: 'var(--fg-mute)' }}>vs prev. period</span>
            <Icon.chevronDown width="12" height="12" style={{ color: 'var(--fg-mute)' }} />
          </button>
          <CalendarPopover
            open={calOpen}
            value={range}
            onClose={() => setCalOpen(false)}
            onApply={(r) => {
              console.log('r', r);
              store.setDateRange(dateKey, r.formattedRange);
            }} />
        </div>
        }
        <button
          className={cn(ctrlBase, 'w-9 px-0', 'group')}
          title="Refresh"
          onClick={() => refreshPageData(pathname)}
        >
          <Icon.refresh
            width="16"
            height="16"
            className="transition-transform duration-500 group-hover:rotate-180"
          />
        </button>

        {/* toggle  UI theme */}
        {/* <ThemeSwitcher /> */}



        {/* User menu */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button className={cn(ctrlBase, 'w-9 px-0')} title="Account" onClick={() => setIsOpen(true)}>
              <Icon.user width="16" height="16" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userName}
                </p>
                {user?.adminid && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.adminid}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={logout}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
