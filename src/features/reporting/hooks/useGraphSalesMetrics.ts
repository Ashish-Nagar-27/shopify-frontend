import { useDateStore } from "@/store/useDateStore";
import { reportingApi } from "../api/reportingApi";
import { useQuery } from "@tanstack/react-query";


const useGraphSalesMetrics = () => {

    const { reportingDates } = useDateStore();

    const [startDate, endDate] = reportingDates;

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

            return data;
        },
        enabled: Boolean(startDate && endDate),
    });

    return {
        graphData, graphDataLoading, graphDataError,
    }
}

export default useGraphSalesMetrics
