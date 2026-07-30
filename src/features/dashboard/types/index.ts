import React from "react";

export interface DateRange {
    start: Date;
    end: Date;
}

export interface MetricTileData {
    key: string;
    label: string;
    val: string;
    unit?: string;
    suffix?: boolean;
    delta: string;
    tone: "up" | "down" | "neutral";
    color: string;
    spark: number[];
}

export interface ChannelMetricData {
    name: string;
    color: string;
    sessions: number;
    clicks: number;
    conv: number;
    sales: number;
    cpa: number;
    spend: number;
    rev: number;
    roas: number;
    roi: number;
}

export interface PerformanceSeriesData {
    key: string;
    label: string;
    color: string;
    stroke: string;
    vals: number[];
}

export interface TrafficSourceData {
    label: string;
    pct: number;
    color: string;
}

export interface VisitorSegmentData {
    label: string;
    pct: number;
    color: string;
    count: number;
}

export interface RecommendationData {
    score: number;
    kind: "scale" | "pause";
    tag: string;
    title: string;
    parent: string;
    bullets: string[];
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: string | number;
    height?: string | number;
}




export interface AreaSparkProps {
    data: { date: string; value: number }[];
    color: string;
    id: string;
    metricKey: string;
}


export interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        name: string;
        value: number;
        stroke: string;
        color: string;
        payload: {
            date: string;
            month: string;
            year: string;
            [key: string]: any;
        };
    }>;
    label?: string;
    chartData: any[];
}
