import { api } from "@/services/api";

export const reportingApi = {
    getTableData: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/table?${queryParams.toString()}`);
        return response.data;
    },
    getGraphSales: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/graphsales?${queryParams.toString()}`);
        return response.data;
    }
};
