import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportingApi } from '../api/reportingApi';
import { useDateStore } from '@/store/useDateStore';
import { useReportingStore } from '@/store/useReportingStore';

export interface ReportingTableParams {
    attribute?: string;
    traffic?: string;
    account?: string;
    click_type?: string;
    window?: string;
}

export const useReportingTableData = (params?: ReportingTableParams) => {
    const { reportingDates } = useDateStore();
    const { filter, traffic: storeTraffic, account: storeAccount } = useReportingStore();
    const [startDate, endDate] = reportingDates;


    const attribute = filter?.model || "last";
    const traffic =  storeTraffic || "Facebook";
    // const account = filter?.account || storeAccount || "All";
    const click_type = filter?.clickHandling || "paid";
    const windowParam = filter?.window || "999";
    // console.log('acc ',account)


    const { data: tableData, isLoading: tableDataLoading, error: tableDataError } = useQuery({
        queryKey: [
            "reportingTable",
            { attribute, startDate, endDate, traffic, click_type, window: windowParam },
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();

            if (attribute) queryParams.append("attribute", attribute);
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);
            if (traffic) queryParams.append("traffic", traffic);
            // if (account) queryParams.append("account", account);
            if (click_type) queryParams.append("click_type", click_type);
            if (windowParam) queryParams.append("window", windowParam);

            const data = await reportingApi.getTableData(queryParams);
            console.log("Reporting Table Data:", data);
            return data;
        },
        enabled: Boolean(startDate && endDate),
    });

    const { data: graphData, isLoading: graphDataLoading, error: graphDataError } = useQuery({
        queryKey: [
            "reportingGraphSalesMetrics",
            { startDate, endDate },
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);

            const data = await reportingApi.getGraphSalesMetrics(queryParams);
            console.log("Graph Sales Metrics Data:", data);
            return data;
        },
        enabled: Boolean(startDate && endDate),
    });

    const { data: sourceData, isLoading: sourceDataLoading, error: sourceDataError } = useQuery({
        queryKey: ["reportingSource"],
        queryFn: async () => {
            const data = await reportingApi.getSource();
            console.log("Source Data:", data);
            return data;
        },
    });

    const { data: adsAccountsData, isLoading: adsAccountsDataLoading, error: adsAccountsDataError } = useQuery({
        queryKey: ["reportingAdsAccounts"],
        queryFn: async () => {
            const data = await reportingApi.getAdsAccounts();
            console.log("Ads Accounts Data:", data);
            return data;
        },
    });

    const queryClient = useQueryClient();

    const { data: customizedColumnsData, isLoading: customizedColumnsDataLoading, error: customizedColumnsDataError } = useQuery({
        queryKey: ["reportingCustomizedColumns"],
        queryFn: async () => {
            const data = await reportingApi.getCustomizedColumns();
            console.log("Customized Columns Data:", data);
            return data;
        },
    });

    const updateColumnsMutation = useMutation({
        mutationFn: async ({ updatecols, viewName = 'myview' }: { updatecols: any[]; viewName?: string }) => {
            return await reportingApi.updateCustomizedColumns(updatecols, viewName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reportingCustomizedColumns"] });
        },
    });

    const deleteColumnsMutation = useMutation({
        mutationFn: async (viewName: string) => {
            return await reportingApi.deleteCustomizedColumns(viewName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reportingCustomizedColumns"] });
        },
    });

    // const { data: actionsData, isLoading: actionsDataLoading, error: actionsDataError } = useQuery({
    //     queryKey: ["reportingActions"],
    //     queryFn: async () => {
    //         const data = await reportingApi.getActions();
    //         console.log("Actions Data:", data);
    //         return data;
    //     },
    // });

    return {
        tableData, tableDataLoading, tableDataError,
        graphData, graphDataLoading, graphDataError,
        sourceData, sourceDataLoading, sourceDataError,
        adsAccountsData, adsAccountsDataLoading, adsAccountsDataError,
        customizedColumnsData, customizedColumnsDataLoading, customizedColumnsDataError,
        updateColumnsMutation,
        deleteColumnsMutation,
        // actionsData, actionsDataLoading, actionsDataError
    };
};

export interface TableSaleDataParams {
    adid: string;
    channel?: string;
}

export const useReportingTableSaleData = (params: TableSaleDataParams, enabled = false) => {
    const { reportingDates } = useDateStore();
    const { filter, traffic: storeTraffic } = useReportingStore();
    const [startDate, endDate] = reportingDates;

    const adid = params.adid;
    const channel = params.channel || storeTraffic || "Facebook";
    const attribute = filter?.model || "last";
    const attributeParam = attribute.charAt(0).toUpperCase() + attribute.slice(1);
    const click_type = filter?.clickHandling || "paid";
    const windowParam = filter?.window || "999";
    const islead = false;

    return useQuery({
        queryKey: [
            "reportingTableSaleData",
            { adid, startDate, endDate, channel, attribute: attributeParam, islead, click_type, window: windowParam },
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);
            if (adid) queryParams.append("adid", adid);
            if (channel) queryParams.append("channel", channel);
            queryParams.append("attribute", attributeParam);
            queryParams.append("islead", String(islead));
            if (click_type) queryParams.append("click_type", click_type);
            if (windowParam) queryParams.append("window", windowParam);

            const data = await reportingApi.getTableSaleData(queryParams);
            console.log("Table Sale Data:", data);
            return data;
        },
        enabled: enabled && Boolean(adid && startDate && endDate),
    });
};

export const useReportingTableSaleJourney = (trackid: string, enabled = false) => {
    return useQuery({
        queryKey: ["reportingTableSaleJourney", trackid],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (trackid) queryParams.append("trackid", trackid);

            const data = await reportingApi.getTableSaleJourney(queryParams);
            console.log("Table Sale Journey Data:", data);
            return data;
        },
        enabled: enabled && Boolean(trackid),
    });
};

export const useReportingCustomerProfile = (trackid: string, enabled = false) => {
    return useQuery({
        queryKey: ["reportingCustomerProfile", trackid],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (trackid) queryParams.append("trackid", trackid);

            const data = await reportingApi.getCustomerProfile(queryParams);
            console.log("Customer Profile Data:", data);
            return data;
        },
        enabled: enabled && Boolean(trackid),
    });
};

