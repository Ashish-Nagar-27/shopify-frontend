import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";
import { useDateStore } from "@/store/useDateStore";

export const useGraphSales = () => {
    const { dashboardDates } = useDateStore();
    const [startDate, endDate] = dashboardDates;

    return useQuery({
        queryKey: ["dashboardGraphSales", { startDate, endDate}],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);
           
            return await dashboardApi.graphSales(queryParams);
        },
        enabled: Boolean(startDate && endDate),
    });
};

export const useGraphSalesMetrics = () => {
    const { dashboardDates } = useDateStore();
    const [startDate, endDate] = dashboardDates;

    return useQuery({
        queryKey: ["dashboardGraphSalesMetrics", { startDate, endDate }],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);

            return await dashboardApi.graphSalesMetrics(queryParams);
        },
        enabled: Boolean(startDate && endDate),
    });
};

export const useTrafficSessions = () => {
    const { dashboardDates } = useDateStore();
    const [startDate, endDate] = dashboardDates;

    return useQuery({
        queryKey: ["dashboardTrafficSessions", { startDate, endDate }],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startdate", startDate);
            if (endDate) queryParams.append("enddate", endDate);
           
            return await dashboardApi.trafficSessions(queryParams);
        },
        enabled: Boolean(startDate && endDate),
    });



};
