import { api } from "@/services/api";



export const dashboardApi = {
  graphSales: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/dashboard/dashboardgraphsales?${queryParams.toString()}`);
        return response.data;
    },
    graphSalesMetrics: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/dashboard/dashboardmetric?${queryParams.toString()}`);
        return response.data;
    },
    trafficSessions: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/dashboard/dashboardtrafficsessions?${queryParams.toString()}`);
        return response.data;
    },
}