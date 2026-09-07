import { useDateStore } from "@/store/useDateStore";
import { reportingApi, reportingKeys } from "../api";
import { useQuery } from "@tanstack/react-query";


const useGraphSalesMetrics = () => {

    const { reportingDates } = useDateStore();

    const [startDate, endDate] = reportingDates;

    const { data: graphData, isLoading: graphDataLoading, error: graphDataError } = useQuery({
        queryKey: reportingKeys.graphSalesMetrics({ startDate, endDate }),
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
