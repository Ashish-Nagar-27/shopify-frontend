import { useQueryClient } from "@tanstack/react-query";
import { creativeKeys } from "@/features/creative/api";
import { dashboardKeys } from "@/features/dashboard/api";
import { reportingKeys } from "@/features/reporting/api";

const useApiDataRefresh = () => {
    const queryClient = useQueryClient();

    const refresPageData = (href: string | undefined) => {

        if (!href) {
            return;
        }

        switch (href) {
            case "/dashboard":
                queryClient.resetQueries({ queryKey: dashboardKeys.graphSales() });
                queryClient.resetQueries({ queryKey: dashboardKeys.graphSalesMetrics() });
                queryClient.resetQueries({ queryKey: dashboardKeys.trafficSessions() });
                break;
            case "/reporting":
                queryClient.resetQueries({ queryKey: reportingKeys.table() });
                queryClient.resetQueries({ queryKey: reportingKeys.graphSalesMetrics() });
                break;
            case "/creative":
                console.log('invaliding creative');
                queryClient.resetQueries({ queryKey: creativeKeys.facebookCreativeData() });
                break;
            default:
                break;
        }
    };

    return {
        refresPageData,
    };
};

export default useApiDataRefresh;