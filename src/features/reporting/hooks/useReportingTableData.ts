import { useQuery } from '@tanstack/react-query';
import { reportingApi, reportingKeys } from '../api';
import { useDateStore } from '@/store/useDateStore';
import { useReportingStore } from '@/store/useReportingStore';

export interface ReportingTableParams {
    attribute?: string;
    traffic?: string;
    account?: string;
    click_type?: string;
    window?: string;
}


// fetching main reporting table data
export const useReportingTableData = () => {
    const { performanceDates } = useDateStore();
    const { filter, traffic: storeTraffic } = useReportingStore();
    const [startDate, endDate] = performanceDates;

    const attribute = filter?.model || "last";
    const traffic =  storeTraffic || "Facebook";
    const click_type = filter?.clickHandling || "paid";
    const windowParam = filter?.window || "999";


    const { data: tableData, isLoading: tableDataLoading, error: tableDataError } = useQuery({
        queryKey: reportingKeys.table({ attribute, startDate, endDate, traffic, click_type, window: windowParam }),
        queryFn: async () => {
            const queryParams = new URLSearchParams();

            if (attribute) queryParams.append("attribute", attribute);
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);
            if (traffic) queryParams.append("traffic", traffic);
            if (click_type) queryParams.append("click_type", click_type);
            if (windowParam) queryParams.append("window", windowParam);

            const data = await reportingApi.getTableData(queryParams);
            return data;
        },
        enabled: Boolean(startDate && endDate),
    });

    return {
        tableData, tableDataLoading, tableDataError,
    };
};

export interface TableSaleDataParams {
    adid: string;
    channel?: string;
}


// fetching sales popup table data
export const useReportingTableSaleData = (params: TableSaleDataParams, enabled = false) => {
    const { performanceDates } = useDateStore();
    const { filter, traffic: storeTraffic } = useReportingStore();
    const [startDate, endDate] = performanceDates;

    const adid = params.adid;
    const channel = params.channel || storeTraffic || "Facebook";
    const attribute = filter?.model || "last";
    const attributeParam = attribute.charAt(0).toUpperCase() + attribute.slice(1);
    const click_type = filter?.clickHandling || "paid";
    const windowParam = filter?.window || "999";
    const islead = false;

    return useQuery({
        queryKey: reportingKeys.tableSaleData({ adid, startDate, endDate, channel, attribute: attributeParam, islead, click_type, window: windowParam }),
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
            return data;
        },
        enabled: enabled && Boolean(adid && startDate && endDate),
    });
};


// fetching sale journey data
export const useReportingTableSaleJourney = (trackid: string, enabled = false) => {
    return useQuery({
        queryKey: reportingKeys.tableSaleJourney(trackid),
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (trackid) queryParams.append("trackid", trackid);

            const data = await reportingApi.getTableSaleJourney(queryParams);
            return data;
        },
        enabled: enabled && Boolean(trackid),
    });
};



// fetching customer profile data
export const useReportingCustomerProfile = (trackid: string, enabled = false) => {
    return useQuery({
        queryKey: reportingKeys.customerProfile(trackid),
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (trackid) queryParams.append("trackid", trackid);

            const data = await reportingApi.getCustomerProfile(queryParams);
            return data;
        },
        enabled: enabled && Boolean(trackid),
    });
};


// fetching accounts data
export const useReportingAccount = () => {
    
    const { data: adsAccountsData, isLoading: adsAccountsDataLoading, error: adsAccountsDataError } = useQuery({
        queryKey: reportingKeys.adsAccounts(),
        queryFn: async () => {
            const data = await reportingApi.getAdsAccounts();
            return data;
        },
    });

    return { adsAccountsData, adsAccountsDataLoading, adsAccountsDataError };
}


// fetching sources data
export const useReportingSource = () => {
    const { data: sourceData, isLoading: sourceDataLoading, error: sourceDataError } = useQuery({
        queryKey: reportingKeys.source(),
        queryFn: async () => {
            const data = await reportingApi.getSource();
            return data;
        },
    });

    return {
        sourceData, sourceDataLoading, sourceDataError,
};
}