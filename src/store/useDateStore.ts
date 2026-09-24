import { create } from 'zustand';
import { format, subDays } from 'date-fns';
import { persist } from 'zustand/middleware';

export type DateRange = [string | undefined, string | undefined];

export type StoreKeys = "dashboardDates" | "performanceDates" | "creativeDates" | "settingDates";

interface DateState {
    dashboardDates: DateRange;
    reportingDates: DateRange; 
    performanceDates: DateRange; 
    creativeDates: DateRange;
    settingDates: DateRange;

    setDateRange: (key: StoreKeys, range: DateRange) => void;
}

const getDefaults = (): DateRange => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const startOfLast7Days = subDays(yesterday, 6);
    return [format(startOfLast7Days, "MMM dd yyyy"), format(yesterday, "MMM dd yyyy")];
};

export const useDateStore = create<DateState>()(
    persist(
        (set) => ({
            dashboardDates: getDefaults(),
            reportingDates: getDefaults(),
            creativeDates: getDefaults(),
            settingDates: getDefaults(),
            performanceDates: getDefaults(),

            setDateRange: (key, range) =>
                set((state) => ({
                    ...state,
                    [key]: range,
                })),
        }),
        {
            name: "shopify_client_date",
            partialize: (state) => ({
                dashboardDates: state.dashboardDates,
                reportingDates: state.reportingDates,
                creativeDates: state.creativeDates,
                settingDates: state.settingDates,
                performance: state.performanceDates,
            }),
        }
    )
);