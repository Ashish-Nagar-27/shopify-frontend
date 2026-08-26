
import { useMemo, useState, useCallback } from "react";
import { useGraphSalesMetrics } from "./useDashboardData";
import { formatChannelLabel, getChannelColor } from "../components/utils";
import type { ChartConfig } from "@/components/ui/chart";

export interface ChartDataItem {
    ts: number;      // for the axis
    date: string;    // keep the raw ISO string
    [key: string]: any;
}

export interface ChannelSeries {
    key: string;
    label: string;
    color: string;
    stroke: string;
}

export interface ChannelOption {
    key: string;
    label: string;
    color: string;
    stroke: string;
    isSelected: boolean;
}

const MAX_SELECTED_CHANNELS = 7;

const parseISODate = (dateStr: string): number | null => {
    const parts = dateStr?.split("-");
    if (!parts || parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d).getTime();
};

export const useChannelPerformanceData = () => {
    const { data, isLoading, isError } = useGraphSalesMetrics();

    // 1. All connected channels
    const allConnectedChannels = useMemo(() => {
        if (!data || typeof data !== "object") return [];

        const list: Array<{
            key: string;
            label: string;
            color: string;
            stroke: string;
            dataMap: Map<string, number>;
        }> = [];

        let colorIdx = 0;

        Object.entries(data).forEach(([rawKey, channelData]: [string, any]) => {
            if (rawKey === "overalltotal" || rawKey === "adspend") return;

            const isAccountPresent =
                typeof channelData?.accountpresent === "boolean"
                    ? channelData.accountpresent
                    : Boolean(channelData?.accountpresent);

            if (!isAccountPresent) return;

            const cleanKey = rawKey.trim();
            const label = formatChannelLabel(rawKey);
            const color = getChannelColor(rawKey, colorIdx++);

            const revData: Array<{ date: string; value: number }> = channelData?.revenue?.data ?? [];
            const dataMap = new Map<string, number>();

            revData.forEach((d) => {
                if (d?.date != null) {
                    dataMap.set(d.date, Number(d.value) || 0);
                }
            });

            list.push({
                key: cleanKey,
                label,
                color,
                stroke: color,
                dataMap,
            });
        });

        return list;
    }, [data]);

    // 2. Default selected keys (google + meta if connected, else any first 2)
    const defaultSelectedKeys = useMemo(() => {
        if (!allConnectedChannels.length) return [];

        const keys: string[] = [];

        // Check for google
        const googleCh = allConnectedChannels.find((ch) => ch.key.toLowerCase() === "google");
        if (googleCh) keys.push(googleCh.key);

        // Check for meta or facebook
        const metaCh = allConnectedChannels.find((ch) => {
            const k = ch.key.toLowerCase();
            return k === "meta" || k === "facebook";
        });
        if (metaCh && !keys.includes(metaCh.key)) keys.push(metaCh.key);

        // Fill up to 2 with other connected channels if available
        for (const ch of allConnectedChannels) {
            if (keys.length >= 2) break;
            if (!keys.includes(ch.key)) {
                keys.push(ch.key);
            }
        }

        return keys;
    }, [allConnectedChannels]);

    // 3. User selection state
    const [userSelectedKeys, setUserSelectedKeys] = useState<string[] | null>(null);

    const selectedKeys = useMemo(() => {
        if (userSelectedKeys !== null) {
            const valid = userSelectedKeys.filter((k) => allConnectedChannels.some((ch) => ch.key === k));
            if (valid.length > 0) return valid.slice(0, MAX_SELECTED_CHANNELS);
        }
        return defaultSelectedKeys;
    }, [userSelectedKeys, defaultSelectedKeys, allConnectedChannels]);

    const toggleChannel = useCallback((channelKey: string) => {
        setUserSelectedKeys((prev) => {
            const current = prev !== null ? prev : defaultSelectedKeys;
            if (current.includes(channelKey)) {
                if (current.length <= 1) return current;
                return current.filter((k) => k !== channelKey);
            } else {
                if (current.length >= MAX_SELECTED_CHANNELS) return current;
                return [...current, channelKey];
            }
        });
    }, [defaultSelectedKeys]);

    // Selected series list
    const selectedSeriesList: ChannelSeries[] = useMemo(() => {
        return allConnectedChannels
            .filter((ch) => selectedKeys.includes(ch.key))
            .map((ch) => ({
                key: ch.key,
                label: ch.label,
                color: ch.color,
                stroke: ch.stroke,
            }));
    }, [allConnectedChannels, selectedKeys]);

    // Metadata for all channels to show in dropdown
    const allChannelsMeta: ChannelOption[] = useMemo(() => {
        return allConnectedChannels.map((ch) => ({
            key: ch.key,
            label: ch.label,
            color: ch.color,
            stroke: ch.stroke,
            isSelected: selectedKeys.includes(ch.key),
        }));
    }, [allConnectedChannels, selectedKeys]);

    // Unique dates across connected channels
    const sortedDates = useMemo(() => {
        const dateSet = new Set<string>();
        allConnectedChannels.forEach((ch) => {
            ch.dataMap.forEach((_, dateStr) => dateSet.add(dateStr));
        });
        return Array.from(dateSet).sort();
    }, [allConnectedChannels]);

    // Rows mapped with values for selected channels
    const chartData: ChartDataItem[] = useMemo(() => {
        const activeChannels = allConnectedChannels.filter((ch) => selectedKeys.includes(ch.key));
        return sortedDates
            .map((dateStr) => {
                const ts = parseISODate(dateStr);
                if (ts === null) return null;
                const row: ChartDataItem = {
                    ts,
                    date: dateStr,
                };
                activeChannels.forEach((ch) => {
                    row[ch.key] = (ch.dataMap.get(dateStr) || 0) / 1000;
                });
                return row;
            })
            .filter((r): r is ChartDataItem => r !== null)
            .sort((a, b) => a.ts - b.ts);
    }, [sortedDates, allConnectedChannels, selectedKeys]);

    const maxVal = useMemo(() => {
        return chartData.length > 0 && selectedSeriesList.length > 0
            ? Math.max(
                ...chartData.flatMap((r) =>
                    selectedSeriesList.map((s) => (typeof r[s.key] === "number" ? (r[s.key] as number) : 0))
                )
            )
            : 0;
    }, [chartData, selectedSeriesList]);

    const chartConfig = useMemo(() => {
        return selectedSeriesList.reduce((acc, s) => {
            acc[s.key] = { label: s.label, color: s.stroke };
            return acc;
        }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;
    }, [selectedSeriesList]);

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

    return {
        chartData,
        allMax: maxVal > 0 ? maxVal * 1.18 : 100,
        series: selectedSeriesList,
        allChannels: allChannelsMeta,
        selectedKeys,
        toggleChannel,
        maxAllowed: MAX_SELECTED_CHANNELS,
        chartConfig,
        isLoading,
        isError,
        ticks,
        tickFormatter,
    };
};