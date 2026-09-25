import { fmtO } from "../components/utils";
import { useGraphSales } from "./useDashboardData";


const METRIC_CONFIGS: Record<string, { label: string; unit?: string; suffix?: boolean; color: string }> = {
    roi: {
        label: "ROI",
        unit: "%",
        suffix: true,
        color: "var(--pos)",
    },
    revenue: {
        label: "Revenue",
        unit: undefined,
        suffix: false,
        color: "var(--cyan)",
    },
    sales: {
        label: "Sales",
        unit: undefined,
        suffix: undefined,
        color: "var(--violet)",
    },
    spend: {
        label: "Spend",
        unit: undefined,
        suffix: false,
        color: "var(--magenta)",
    },
};

const ORDERED_KEYS = ["roi", "revenue", "sales", "spend"];

const useChannelPerformanceData = () => {
  const { data ,isLoading, isError} = useGraphSales();

    const metricsToRender = ORDERED_KEYS.map((key) => {
        const config = METRIC_CONFIGS[key];
        const apiMetric = data?.[key];

        const totalVal = apiMetric?.total ?? 0;
        const compareVal = apiMetric?.compare ?? 0;

        const tone = compareVal > 0 ? "up" : compareVal < 0 ? "down" : "neutral";
        const sign = compareVal > 0 ? "+" : "";
        const delta = `${sign}${compareVal.toFixed(1)}%`;
        const val = fmtO(totalVal, key === "roi" ? 2 : 0);

        const rawSpark = apiMetric?.data || [];
        const spark = rawSpark.length >= 2
            ? rawSpark.map((d: any, idx: number) => ({
                date: d.date || String(idx),
                value: d.value ?? 0,
            }))
            : [
                { date: "0", value: totalVal },
                { date: "1", value: totalVal },
            ];

        return {
            key,
            label: config.label,
            unit: config.unit,
            suffix: config.suffix,
            color: config.color,
            val,
            delta,
            tone,
            spark,
        };
    });

    return {
        isLoading, isError, metricsToRender
    }
}

export default useChannelPerformanceData