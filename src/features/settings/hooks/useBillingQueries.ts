import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "../api/queryKeys";
import * as billingApi from "../api/billingApi";
import type { PlanId } from "../types/settings.types";

/** Unified billing overview query (GET /setting/billing/overview) */
export function useBillingOverviewQuery() {
  return useQuery({
    queryKey: settingsKeys.billingOverview(),
    queryFn: billingApi.fetchBillingOverview,
    staleTime: 60 * 1000,
  });
}

export function usePlansQuery() {
  return useQuery({
    queryKey: settingsKeys.plans(),
    queryFn: billingApi.fetchPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentPlanQuery() {
  return useQuery({
    queryKey: settingsKeys.currentPlan(),
    queryFn: billingApi.fetchCurrentPlanSummary,
  });
}

export function useUsageSummaryQuery() {
  return useQuery({
    queryKey: settingsKeys.usage(),
    queryFn: billingApi.fetchUsageSummary,
  });
}

export function useSwitchPlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: PlanId) => billingApi.switchPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.billingOverview() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.currentPlan() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useCancelPlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => billingApi.cancelPlan(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.billingOverview() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.currentPlan() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}
