
import { useMemo } from "react";
import { useGraphSalesMetrics } from "./useDashboardData";
import { PERF_SERIES } from "../components/ChannelPerformance/constants";
import type { ChartConfig } from "@/components/ui/chart";

export interface ChartDataItem {
    ts: number;      // for the axis
    date: string;    // keep the raw ISO string
    google: number;
    meta: number;
}


const parseISODate = (dateStr: string): number | null => {
    const parts = dateStr?.split("-");
    if (!parts || parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d).getTime();
};

export const useChannelPerformanceData = () => {
    const { data, isLoading, isError } = useGraphSalesMetrics();

    const { chartData, allMax } = useMemo(() => {
        const googleData = data?.google?.accountpresent
            ? data?.google?.revenue?.data ?? []
            : [];
        const metaData = data?.meta?.accountpresent
            ? data?.meta?.revenue?.data ?? []
            : [];

        const googleMap = new Map<string, number>();
        googleData.forEach((d: any) => d?.date && googleMap.set(d.date, d.value));

        const metaMap = new Map<string, number>();
        metaData.forEach((d: any) => d?.date && metaMap.set(d.date, d.value));

        const allDates = Array.from(
            new Set([...googleMap.keys(), ...metaMap.keys()])
        ).sort();

        const rows: ChartDataItem[] = allDates
            .map((dateStr) => {
                const ts = parseISODate(dateStr);
                if (ts === null) return null;
                return {
                    ts,
                    date: dateStr,
                    google: (googleMap.get(dateStr) || 0) / 1000,
                    meta: (metaMap.get(dateStr) || 0) / 1000,
                };
            })
            .filter((r): r is ChartDataItem => r !== null)
            .sort((a, b) => a.ts - b.ts);

        const peak = rows.length
            ? Math.max(...rows.flatMap((d) => [d.google, d.meta]))
            : 0;

        return {
            chartData: rows,
            allMax: peak > 0 ? peak * 1.18 : 100,
        };
    }, [data]);

    const chartConfig = useMemo(
        () =>
            PERF_SERIES.reduce((acc, s) => {
                acc[s.key] = { label: s.label, color: s.stroke };
                return acc;
            }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig,
        []
    );

    // 
    const { ticks, tickFormatter } = useMemo(() => {
    if (!chartData.length) return { ticks: [] as number[], tickFormatter: () => "" };

    const from = chartData[0].ts;
    const to = chartData[chartData.length - 1].ts;
    const days = Math.round((to - from) / 86_400_000);

    const target = days <= 31 ? 8 : 10;
    const step = Math.max(1, Math.ceil(chartData.length / target));
    const picked = chartData.filter((_, i) => i % step === 0).map((d) => d.ts);

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const fmt = (value: number, index: number) => {
        const d = new Date(value);
        const day = d.getDate().toString().padStart(2, "0");
        if (days <= 31) return `${MONTHS[d.getMonth()]} ${day}`;

        const prev = picked[index - 1];
        const isNewMonth =
            prev === undefined || new Date(prev).getMonth() !== d.getMonth();
        return isNewMonth ? `${MONTHS[d.getMonth()]} ${day}` : day;
    };

    return { ticks: picked, tickFormatter: fmt };
}, [chartData]);

    return { chartData, allMax, chartConfig, isLoading, isError, ticks, tickFormatter };
};