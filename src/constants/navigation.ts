import { grid, chart, ad, settings ,} from "@/components/icons";
import type { StoreKeys } from "@/store/useDateStore";

// key = uniqe for mapping
// icon for sidebar 
// href = for linking route
// headerTitle = for header title of page
// dateKey = unque date key calendar associated with particular page used in global state and pages


export type TNavItem = {
    key: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
    headerTitle: string;
    dateKey: StoreKeys;
    position?: 'top' | 'bottom' | "noPosition";
}


// "dashboardDates", "reportingDates", "creativeDates", "settingDates"
export const NAV_ITEMS: TNavItem[] = [
    {
        key: "dash",
        icon: grid,
        label: "Dashboard",
        href: "/dashboard",
        headerTitle: "Overview",
        dateKey: "dashboardDates",
        position: "top",
    },
    {
        key: "performance",
        icon: chart,
        label: "Performance",
        href: "/performance",
        headerTitle: "Performance",
        dateKey: "performanceDates",
        position: "top",
    },
    {
        key: "creative",
        icon: ad,
        label: "Creative",
        href: "/creative",
        headerTitle: "Creative Insights",
        dateKey: "creativeDates",
        position: "top",
    },
    {
        key: "settings",
        icon: settings,
        label: "Settings",
        href: "/settings",
        headerTitle: "Settings",
        dateKey: "settingDates",
        position: "bottom",
    },
    {
        key: "profile",
        icon: settings,
        label: "Profile",
        href: "/profile",
        headerTitle: "Profile",
        dateKey: "settingDates",
        position: "noPosition",
    },

];

export const TOP_NAV_ITEMS = NAV_ITEMS.filter((item) => item.position !== 'bottom' && item.position !== 'noPosition');
export const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter((item) => item.position === 'bottom');