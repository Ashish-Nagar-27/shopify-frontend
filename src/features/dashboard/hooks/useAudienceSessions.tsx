import { useTrafficSessions } from "./useDashboardData";
import type { TrafficSourceData, VisitorSegmentData } from "../types";


const TOOLTIPS: Record<string, string> = {
    Organic: "Traffic from search engines.",
    Social: "Unpaid clicks from social platforms.",
    Custom: "Untracked or unknown sources.",
    Direct: "Traffic with no referring source.",
    Paid: "Traffic from paid ads.",
};

interface UseAudienceSessionsOptions {
    enabled?: boolean;
}

const useAudienceSessions = (options?: UseAudienceSessionsOptions) => {

    const { data, isLoading: isQueryLoading, isError } = useTrafficSessions(options);
    const isLoading = isQueryLoading || !data;

    //   billable section data 
    const billableValue = data?.billable_sessions?.value ?? 0;
    const billableCompare = data?.billable_sessions?.compare ?? 0;

    const growth = billableCompare;
    const tone = growth > 0 ? "up" : growth < 0 ? "down" : "neutral";
    const sign = growth > 0 ? "+" : "";
    const growthText = `${sign}${growth.toFixed(1)}%`;
    const deltaColor =
        tone === "up"
            ? "text-pos bg-pos-soft"
            : tone === "down"
                ? "text-neg bg-neg-soft"
                : "text-fg-mute bg-surface-2";


    //  donut chart 1 data
    const apiSources = data?.sources || {};
    const hasSources = Object.keys(apiSources).length > 0;

    const trafficData: TrafficSourceData[] = hasSources
        ? [
            { label: "Custom", pct: apiSources.custom?.pct ?? 0, count: apiSources.custom?.count ?? 0, color: "var(--warn)" },
            { label: "Direct", pct: apiSources.direct?.pct ?? 0, count: apiSources.direct?.count ?? 0, color: "var(--blue-accent)" },
            { label: "Organic", pct: apiSources.organic?.pct ?? 0, count: apiSources.organic?.count ?? 0, color: "var(--cyan)" },
            { label: "Paid", pct: apiSources.paid?.pct ?? 0, count: apiSources.paid?.count ?? 0, color: "var(--violet)" },
            { label: "Social", pct: apiSources.social?.pct ?? 0, count: apiSources.social?.count ?? 0, color: "var(--magenta)" },
        ].filter((s) => s.pct > 0)
        : [];

    const lead = trafficData.length > 0
        ? trafficData.reduce((a, b) => (b.pct > a.pct ? b : a), trafficData[0])
        : { label: "None", pct: 0, color: "var(--surface-2)" };



    //  new vs returning visitors data (donut chart 2)
    const visitorsTotal = data?.visitors?.total ?? 0;
    const newPct = data?.visitors?.new?.pct ?? 0;
    const newCount = data?.visitors?.new?.count ?? 0;
    const returningPct = data?.visitors?.returning?.pct ?? 0;
    const returningCount = data?.visitors?.returning?.count ?? 0;

    const segs: VisitorSegmentData[] = [
        { label: "New visitors", pct: newPct, color: "var(--cyan)", count: newCount },
        {
            label: "Returning visitors",
            pct: returningPct,
            color: "var(--magenta)",
            count: returningCount,
        },
    ];

   return {
    billableValue, 
    billableCompare, 
    growth, 
    tone, 
    sign, 
    growthText, 
    deltaColor, 
    trafficData, 
    lead, 
    visitorsTotal, 
    newPct, 
    newCount, 
    returningPct, 
    returningCount, 
    segs,
    isLoading,
    isError,
    TOOLTIPS
   }

}

export default useAudienceSessions