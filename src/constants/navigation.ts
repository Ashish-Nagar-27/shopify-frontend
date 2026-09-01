import { grid, chart, ad ,} from "@/components/icons";
import type { StoreKeys } from "@/store/useDateStore";

// key = uniqe for mapping
// icon for sidebar 
// href = for linking route
// headerTitle = for header title of page
// dateKey = unque date key calendar associated with particular page used in global state and pages


type TNavItem = {
    key: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
    headerTitle: string;
    dateKey: StoreKeys;
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
    },
    {
        key: "report",
        icon: chart,
        label: "reportingDates",
        href: "/reporting",
        headerTitle: "Performance",
        dateKey: "reportingDates",
    },
    {
        key: "creative",
        icon: ad,
        label: "Creative",
        href: "/creative",
        headerTitle: "Creative Insights",
        dateKey: "creativeDates",
    },
];