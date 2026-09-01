import { useQueryClient } from "@tanstack/react-query";

const useApiDataRefresh = () => {
    const queryClient = useQueryClient();

    const refresPageData = (href: string | undefined) => {

        if (!href) {
            return;
        }

        switch (href) {
            case "/dashboard":
                queryClient.resetQueries({ queryKey: ["dashboardGraphSales"] });
                queryClient.resetQueries({ queryKey: ["dashboardGraphSalesMetrics"] });
                queryClient.resetQueries({ queryKey: ["dashboardTrafficSessions"] });
                break;
            case "/reporting":
                queryClient.resetQueries({ queryKey: ["reportingTable"] });
                queryClient.resetQueries({ queryKey: ["reportingGraphSalesMetrics"] });
                break;
            case "/creative":
                console.log('invaliding creative');
                queryClient.resetQueries({ queryKey: ["facebookCreativeData"] });
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