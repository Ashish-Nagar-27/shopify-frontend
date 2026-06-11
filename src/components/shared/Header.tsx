// import { useLocation } from "react-router-dom";

// import { useAuthStore } from "@/store/useAuthStore";
// import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
// import { Button } from "@/components/ui/button";

// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useDateStore } from "@/store/useDateStore";

// import { DateRangePickerControlled } from "./DateRangePickerControlled";

// /**
//  * Route → page metadata mapping.
//  * Add new routes here so the header auto-populates title + subtitle.
//  */
// const PAGE_META: Record<string, { title: string; subtitle: string }> = {
//     "/dashboard": {
//         title: "Dashboard",
//         subtitle: "Overview of your store performance and analytics.",
//     },
//     "/dashboard/overview": {
//         title: "Overview",
//         subtitle: "A high-level look at your store metrics.",
//     },
//     "/dashboard/ai-insight": {
//         title: "AI Insight",
//         subtitle: "AI-powered analytics and recommendations.",
//     },
//     "/dashboard/demographic": {
//         title: "Demographic",
//         subtitle: "Audience breakdown and demographic insights.",
//     },
//     "/reporting": {
//         title: "Reporting",
//         subtitle: "View detailed reports and insights for your campaigns.",
//     },
//     "/creative": {
//         title: "Creative",
//         subtitle: "Manage and create your ad creatives and assets.",
//     },
//     "/settings": {
//         title: "Settings",
//         subtitle: "Configure your application preferences and account settings.",
//     },
//     "/profile": {
//         title: "Profile",
//         subtitle: "Manage your personal profile and preferences.",
//     },
//     "/billing": {
//         title: "Billing",
//         subtitle: "Scale your analytics with simple, transparent pricing.",
//     },
//     "/integration": {
//         title: "Integrations",
//         subtitle: "Connect your store to get started with powerful analytics.",
//     },
// };

// /** Optional overrides when you use `<Header title="…" subtitle="…" />` */
// interface HeaderProps {
//     title?: string;
//     subtitle?: string;
// }

// export default function Header({ title, subtitle , showDatePicker=false }: HeaderProps) {
//     const { pathname } = useLocation();
//     const { user, logout } = useAuthStore();
//     // Resolve page meta from props → route map → fallback
//     const meta = PAGE_META[pathname];
//     const pageTitle = title ?? meta?.title ?? "Trackocity";
//     const pageSubtitle = subtitle ?? meta?.subtitle;

//     // User initials for the avatar
//     const userName = user?.adminid ? user.adminid.split('@')[0] : "User";
//     const initials = userName
//         .split(/[._-]/)
//         .map((n: string) => n[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2);

//     const today = new Date();

//     // Match route to defined store keys
//     type StoreKeys = "dashboardDates" | "reportingDates" | "creativeDates" | "settingDates";
//     const routeName = pathname.split('/')[1] || "dashboard";
//     const possibleKey = `${routeName}Dates`;

//     // Safely fallback to dashboardDates
//     const storeKey: StoreKeys = (["dashboardDates", "reportingDates", "creativeDates", "settingDates"].includes(possibleKey))
//         ? (possibleKey as StoreKeys)
//         : "dashboardDates";

//     const store = useDateStore();
//     const currentDates = store[storeKey];

//     const startDate = currentDates[0];
//     const endDate = currentDates[1];

//     const handleApply = (start: string | undefined, end: string | undefined) => {
//         store.setDateRange(storeKey, [start, end]);

       
//         // fire your API call, update zustand store, etc.
//     }

//     return (
//         <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
//             <div className="flex h-16 items-center justify-between px-6">
//                 {/* ─── Left: Page title + subtitle ─── */}
//                 <div className="flex flex-col justify-center">
//                     <h1 className="text-lg font-semibold leading-tight text-foreground">
//                         {pageTitle}
//                     </h1>
//                     {pageSubtitle && (
//                         <p className="text-sm text-muted-foreground">
//                             {pageSubtitle}
//                         </p>
//                     )}
//                 </div>




//                 <div className="flex items-center gap-2 md:gap-4">
//                     {/* ─── Right: actions ─── */}
//                 {showDatePicker &&  <div className="">
//                         {/* Date Picker ─── */}
//                         <DateRangePickerControlled
//                             startDate={startDate}
//                             endDate={endDate}
//                             onApply={handleApply}
//                             disabled={{ after: today }}
//                             endMonth={today}
//                         />
//                     </div>
//                 }
//                     <ThemeSwitcher />

//                     {/* User menu */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="ghost"
//                                 className="relative flex items-center gap-2 rounded-full px-2"
//                             >
//                                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
//                                     {initials}
//                                 </span>
//                                 <span className="hidden text-sm font-medium text-foreground md:inline-block">
//                                     {userName}
//                                 </span>
//                             </Button>
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent align="end" className="w-56">
//                             <DropdownMenuLabel className="font-normal">
//                                 <div className="flex flex-col space-y-1">
//                                     <p className="text-sm font-medium leading-none">
//                                         {userName}
//                                     </p>
//                                     {user?.adminid && (
//                                         <p className="text-xs leading-none text-muted-foreground">
//                                             {user.adminid}
//                                         </p>
//                                     )}
//                                 </div>
//                             </DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                                 className="cursor-pointer text-destructive focus:text-destructive"
//                                 onClick={logout}
//                             >
//                                 Sign out
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>
//         </header>
//     );
// }

import { useState, useRef } from 'react';
import { MONTHS, fmtDate, cn } from '@/lib/utils';
// import { CalendarPopover } from './CalendarPopover';
import type { DateRange } from './CalendarPopover';
import * as Icon from '@/components/icons';
import { CalendarPopover } from './CalendarPopover';
import { ThemeSwitcher } from './ThemeSwitcher';
import DateRangePickerControlled from './DateRangePickerControlled';

const ctrlBase = 'inline-flex items-center justify-center gap-2 h-9 bg-surface border border-border-soft rounded-[10px] text-fg-dim text-[13px] transition-[border-color,color,background] duration-150 hover:border-border hover:text-fg';

export default function TopBar({showDatePicker}) {
  const [calOpen, setCalOpen] = useState(false);
  const todayRef = useRef(new Date());
  todayRef.current.setHours(0, 0, 0, 0);
  const today = todayRef.current;

  const defaultRange: DateRange = {
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    end: today,
  };
  const [range, setRange] = useState<DateRange>(defaultRange);

  const sameMonth =
    range.start.getMonth() === range.end.getMonth() &&
    range.start.getFullYear() === range.end.getFullYear();

  const label = sameMonth
    ? `${String(range.start.getDate()).padStart(2, '0')} — ${String(range.end.getDate()).padStart(2, '0')} ${MONTHS[range.end.getMonth()].slice(0, 3)} ${range.end.getFullYear()}`
    : `${fmtDate(range.start)} — ${fmtDate(range.end)}`;

  return (
    <header className="flex items-center justify-between px-7 py-[18px] gap-6 border-b border-border-soft bg-[linear-gradient(180deg,oklch(0.16_0.02_235/0.9),oklch(0.16_0.02_235/0.4))] [backdrop-filter:blur(8px)] sticky top-0 z-[4]">
      <div className="flex items-center gap-[14px]">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] m-0">Performance</h1>
        <span className="text-fg-faint font-light">/</span>
        <button
          className="flex items-center gap-[10px] py-[7px] pr-3 pl-2 bg-surface border border-border-soft rounded-full text-[13px] text-fg-dim transition-[border-color] duration-150 hover:border-border"
          title="Switch account">
          <span className="w-6 h-6 rounded-full bg-[linear-gradient(135deg,var(--magenta),var(--cyan))] grid place-items-center text-[oklch(0.10_0.018_240)] font-bold text-[11px]">
            R
          </span>
          <span>Ravi · Pumalyze Demo</span>
          <Icon.chevronDown width="14" height="14" style={{ color: 'var(--fg-mute)' }} />
        </button>
      </div>

      <div className="flex items-center gap-[10px]">
      {showDatePicker &&  <div style={{ position: 'relative' }}>
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
            onApply={(r) =>{ console.log('r', r); setRange(r)}} />
        </div>
        }
        <button className={cn(ctrlBase, 'w-9 px-0')} title="Refresh">
          <Icon.refresh width="16" height="16" />
        </button>
        <ThemeSwitcher />
        <button className={cn(ctrlBase, 'w-9 px-0')} title="Account">
          <Icon.user width="16" height="16" />
        </button>
      </div>
    </header>
  );
}
