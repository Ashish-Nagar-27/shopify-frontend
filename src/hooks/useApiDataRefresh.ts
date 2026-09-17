import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { creativeKeys } from "@/features/creative/api";
import { dashboardKeys } from "@/features/dashboard/api";
import { reportingKeys } from "@/features/reporting/api";
import { settingsKeys } from "@/features/settings/api/queryKeys";

interface RefreshRule {
    prefix: string;           // matched with startsWith, most specific first
    getQueryKeys: () => QueryKey[];
}

export const normalizePath = (path: string): string => {
    if (!path) return "/";
    const clean = path.split("?")[0].split("#")[0].trim().toLowerCase();
    return clean.replace(/\/+$/, "") || "/";
};

// Order matters: more specific prefixes must come before their parents.
export const ROUTE_REFRESH_RULES: RefreshRule[] = [
    { prefix: "/settings/integrations", getQueryKeys: () => [settingsKeys.integrations()] },
    { prefix: "/settings/sub-accounts", getQueryKeys: () => [settingsKeys.teamMembers(), settingsKeys.usage()] },
    {
        prefix: "/settings/billing", getQueryKeys: () => [
            settingsKeys.billingOverview(), settingsKeys.plans(), settingsKeys.currentPlan(), settingsKeys.usage(),
        ]
    },
    { prefix: "/settings", getQueryKeys: () => [settingsKeys.all] },

    {
        prefix: "/dashboard", getQueryKeys: () => [
            dashboardKeys.graphSales(), dashboardKeys.graphSalesMetrics(), dashboardKeys.trafficSessions(),
        ]
    },
    {
        prefix: "/reporting", getQueryKeys: () => [
            reportingKeys.table(), reportingKeys.graphSalesMetrics(), reportingKeys.adsAccounts(), reportingKeys.source(),
        ]
    },
    { prefix: "/creative", getQueryKeys: () => [creativeKeys.facebookCreativeData()] },
    { prefix: "/integration", getQueryKeys: () => [settingsKeys.integrations()] },
    { prefix: "/pricing", getQueryKeys: () => [settingsKeys.plans(), settingsKeys.currentPlan()] },
    {
        prefix: "/onboarding", getQueryKeys: () => [
            ["onboardingStatus"], ["embedStatus"], ["integrations"],
        ]
    },
];

const useApiDataRefresh = () => {
    const queryClient = useQueryClient();
    const location = useLocation();

    const refreshPageData = useCallback(
        (href?: string) => {
            const path = normalizePath(href ?? location.pathname);
           console.log('path ', path)
            const rule = ROUTE_REFRESH_RULES.find((r) => path.startsWith(r.prefix));
            if (rule) {
                rule.getQueryKeys().forEach((key) => queryClient.resetQueries({ queryKey: key }));
                return;
            }

            // Fallback for unmapped routes: reset by root segment
            const root = path.split("/").filter(Boolean)[0];
            if (root) queryClient.resetQueries({ queryKey: [root], exact: false });
        },
        [queryClient, location.pathname]
    );

    return { refreshPageData };
};

export default useApiDataRefresh;