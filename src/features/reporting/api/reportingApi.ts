import { api } from "@/services/api";

export const reportingApi = {
    getTableData: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/table?${queryParams.toString()}`);
        return response.data;
    },
    getGraphSales: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/graphsales?${queryParams.toString()}`);
        return response.data;
    },
    getGraphSalesMetrics: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/graphsalesmetrics?${queryParams.toString()}`);
        return response.data;
    },
    getActions: async (): Promise<any> => {
        const response = await api.get(`/reporting/actions`);
        return response.data;
    },
    getSource: async (): Promise<any> => {
        const response = await api.get(`/reporting/source`);
        return response.data;
    },
    getAdsAccounts: async (): Promise<any> => {
        const response = await api.get(`/reporting/useraccounts`);
        return response.data;
    },
    getCustomizedColumns: async (viewName?: string): Promise<any> => {
        const url = viewName
            ? `/setting/reporting/get_customize_column?report=reporting&view_name=${viewName}`
            : `/setting/reporting/get_customize_column?report=reporting`;
        const response = await api.get(url);
        return response.data;
    },
    updateCustomizedColumns: async (updatecols: any[], viewName = 'myview'): Promise<any> => {
        const response = await api.post(`/setting/reporting/update_customize_column?report=reporting&view_name=${viewName}`, updatecols);
        return response.data;
    },
    deleteCustomizedColumns: async (viewName: string): Promise<any> => {
        const response = await api.post(`/setting/reporting/update_customize_column?report=reporting&deleteview=true&view_name=${viewName}`, 
        {
    "deleteview": true
});
        return response.data;
    },
    getTableSaleData: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/tablesaledata?${queryParams.toString()}`);
        return response.data;
    },
    getTableSaleJourney: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/tablesalejourney?${queryParams.toString()}`);
        return response.data;
    },
    getCustomerProfile: async (queryParams: URLSearchParams): Promise<any> => {
        const response = await api.get(`/reporting/customerprofile?${queryParams.toString()}`);
        return response.data;
    },
};

