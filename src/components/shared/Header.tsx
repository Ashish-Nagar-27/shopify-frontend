import { useLocation } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDateStore } from "@/store/useDateStore";

import { DateRangePickerControlled } from "./DateRangePickerControlled";

/**
 * Route → page metadata mapping.
 * Add new routes here so the header auto-populates title + subtitle.
 */
const PAGE_META: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Overview of your store performance and analytics.",
    },
    "/dashboard/overview": {
        title: "Overview",
        subtitle: "A high-level look at your store metrics.",
    },
    "/dashboard/ai-insight": {
        title: "AI Insight",
        subtitle: "AI-powered analytics and recommendations.",
    },
    "/dashboard/demographic": {
        title: "Demographic",
        subtitle: "Audience breakdown and demographic insights.",
    },
    "/reporting": {
        title: "Reporting",
        subtitle: "View detailed reports and insights for your campaigns.",
    },
    "/creative": {
        title: "Creative",
        subtitle: "Manage and create your ad creatives and assets.",
    },
    "/settings": {
        title: "Settings",
        subtitle: "Configure your application preferences and account settings.",
    },
    "/profile": {
        title: "Profile",
        subtitle: "Manage your personal profile and preferences.",
    },
    "/billing": {
        title: "Billing",
        subtitle: "Scale your analytics with simple, transparent pricing.",
    },
    "/integration": {
        title: "Integrations",
        subtitle: "Connect your store to get started with powerful analytics.",
    },
};

/** Optional overrides when you use `<Header title="…" subtitle="…" />` */
interface HeaderProps {
    title?: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const { pathname } = useLocation();
    const { user, logout } = useAuthStore();
    // Resolve page meta from props → route map → fallback
    const meta = PAGE_META[pathname];
    const pageTitle = title ?? meta?.title ?? "Trackocity";
    const pageSubtitle = subtitle ?? meta?.subtitle;

    // User initials for the avatar
    const userName = user?.adminid ? user.adminid.split('@')[0] : "User";
    const initials = userName
        .split(/[._-]/)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const today = new Date();

    // Match route to defined store keys
    type StoreKeys = "dashboardDates" | "reportingDates" | "creativeDates" | "settingDates";
    const routeName = pathname.split('/')[1] || "dashboard";
    const possibleKey = `${routeName}Dates`;

    // Safely fallback to dashboardDates
    const storeKey: StoreKeys = (["dashboardDates", "reportingDates", "creativeDates", "settingDates"].includes(possibleKey))
        ? (possibleKey as StoreKeys)
        : "dashboardDates";

    const store = useDateStore();
    const currentDates = store[storeKey];

    const startDate = currentDates[0];
    const endDate = currentDates[1];

    const handleApply = (start: string | undefined, end: string | undefined) => {
        store.setDateRange(storeKey, [start, end]);

       
        // fire your API call, update zustand store, etc.
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
                {/* ─── Left: Page title + subtitle ─── */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-lg font-semibold leading-tight text-foreground">
                        {pageTitle}
                    </h1>
                    {pageSubtitle && (
                        <p className="text-sm text-muted-foreground">
                            {pageSubtitle}
                        </p>
                    )}
                </div>




                <div className="flex items-center gap-2 md:gap-4">
                    {/* ─── Right: actions ─── */}
                    <div className="">
                        {/* Date Picker ─── */}
                        <DateRangePickerControlled
                            startDate={startDate}
                            endDate={endDate}
                            onApply={handleApply}
                            disabled={{ after: today }}
                            endMonth={today}
                        />
                    </div>

                    <ThemeSwitcher />

                    {/* User menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative flex items-center gap-2 rounded-full px-2"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                    {initials}
                                </span>
                                <span className="hidden text-sm font-medium text-foreground md:inline-block">
                                    {userName}
                                </span>
                            </Button>
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
            </div>
        </header>
    );
}