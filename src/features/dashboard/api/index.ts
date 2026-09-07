import { api } from "@/services/api";
import type {
    DashboardGraphSalesResponse,
    DashboardGraphSalesMetricsResponse,
    TrafficSessionsResponse,
} from "../types";

export const dashboardApi = {
    graphSales: async (queryParams: URLSearchParams): Promise<DashboardGraphSalesResponse> => {
        const response = await api.get<DashboardGraphSalesResponse>(`/dashboard/dashboardgraphsales?${queryParams.toString()}`);
        return response.data;
    },
    graphSalesMetrics: async (queryParams: URLSearchParams): Promise<DashboardGraphSalesMetricsResponse> => {
        const response = await api.get<DashboardGraphSalesMetricsResponse>(`/dashboard/dashboardmetric?${queryParams.toString()}`);
        return response.data;
    },
    trafficSessions: async (queryParams: URLSearchParams): Promise<TrafficSessionsResponse> => {
        const response = await api.get<TrafficSessionsResponse>(`/dashboard/dashboardtrafficsessions?${queryParams.toString()}`);
        return response.data;
    },
};

export * from "./queryKeys";