import { useQuery } from '@tanstack/react-query';
import { reportingApi } from '../api/reportingApi';
import { useDateStore } from '@/store/useDateStore';
import { useQueryClient } from '@tanstack/react-query';

export interface ReportingTableParams {
    attribute?: string;
    traffic?: string;
    click_type?: string;
    window?: string;
}

export const useReportingTableData = (params?: ReportingTableParams) => {
    const { reportingDates } = useDateStore();
    const [startDate, endDate] = reportingDates;

    const attribute = params?.attribute || "last";
    const traffic = params?.traffic || "Facebook";
    const click_type = params?.click_type || "paid";
    const windowParam = params?.window || "999";

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
            if (click_type) queryParams.append("click_type", click_type);
            if (windowParam) queryParams.append("window", windowParam);

            return reportingApi.getTableData(queryParams);
        },
        enabled: Boolean(startDate && endDate),
    });

    const { data: graphData, isLoading: graphDataLoading, error: graphDataError } = useQuery({
        queryKey: [
            "reportingGraphSales",
            { startDate, endDate },
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);

            return reportingApi.getGraphSales(queryParams);
        },
        enabled: Boolean(startDate && endDate),
    });

    return {
        tableData, tableDataLoading, tableDataError,
        graphData, graphDataLoading, graphDataError
    };
};
