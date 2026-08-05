import { api } from "@/services/api";
import type {
    ReportingTableDataResponse,
    GraphSalesResponse,
    GraphSalesMetricsResponse,
    ActionsResponse,
    SourceResponse,
    AdsAccountsResponse,
    CustomizedColumnsResponse,
    CustomizedColumnItem,
    CustomizeColumnMutationResponse,
    ReportingTableSaleDataResponse,
    TableSaleJourneyResponse,
    CustomerProfileResponse,
} from "../types";

export const reportingApi = {
    getTableData: async (queryParams: URLSearchParams): Promise<ReportingTableDataResponse> => {
        const response = await api.get<ReportingTableDataResponse>(`/reporting/table?${queryParams.toString()}`);
        return response.data;
    },
    getGraphSales: async (queryParams: URLSearchParams): Promise<GraphSalesResponse> => {
        const response = await api.get<GraphSalesResponse>(`/reporting/graphsales?${queryParams.toString()}`);
        return response.data;
    },
    getGraphSalesMetrics: async (queryParams: URLSearchParams): Promise<GraphSalesMetricsResponse> => {
        const response = await api.get<GraphSalesMetricsResponse>(`/reporting/graphsalesmetrics?${queryParams.toString()}`);
        return response.data;
    },
    getActions: async (): Promise<ActionsResponse> => {
        const response = await api.get<ActionsResponse>(`/reporting/actions`);
        return response.data;
    },
    getSource: async (): Promise<SourceResponse> => {
        const response = await api.get<SourceResponse>(`/reporting/source`);
        return response.data;
    },
    getAdsAccounts: async (): Promise<AdsAccountsResponse> => {
        const response = await api.get<AdsAccountsResponse>(`/reporting/useraccounts`);
        return response.data;
    },
    getCustomizedColumns: async (viewName?: string): Promise<CustomizedColumnsResponse> => {
        const url = viewName
            ? `/setting/reporting/get_customize_column?report=reporting&view_name=${viewName}`
            : `/setting/reporting/get_customize_column?report=reporting`;
        const response = await api.get<CustomizedColumnsResponse>(url);
        return response.data;
    },
    updateCustomizedColumns: async (updatecols: CustomizedColumnItem[], viewName = 'myview'): Promise<CustomizeColumnMutationResponse> => {
        const response = await api.post<CustomizeColumnMutationResponse>(`/setting/reporting/update_customize_column?report=reporting&view_name=${viewName}`, updatecols);
        return response.data;
    },
    deleteCustomizedColumns: async (viewName: string): Promise<CustomizeColumnMutationResponse> => {
        const response = await api.post<CustomizeColumnMutationResponse>(`/setting/reporting/update_customize_column?report=reporting&deleteview=true&view_name=${viewName}`, 
        {
            "deleteview": true
        });
        return response.data;
    },
    getTableSaleData: async (queryParams: URLSearchParams): Promise<ReportingTableSaleDataResponse> => {
        const response = await api.get<ReportingTableSaleDataResponse>(`/reporting/tablesaledata?${queryParams.toString()}`);
        return response.data;
    },
    getTableSaleJourney: async (queryParams: URLSearchParams): Promise<TableSaleJourneyResponse> => {
        const response = await api.get<TableSaleJourneyResponse>(`/reporting/tablesalejourney?${queryParams.toString()}`);
        return response.data;
    },
    getCustomerProfile: async (queryParams: URLSearchParams): Promise<CustomerProfileResponse> => {
        const response = await api.get<CustomerProfileResponse>(`/reporting/customerprofile?${queryParams.toString()}`);
        return response.data;
    },
};

