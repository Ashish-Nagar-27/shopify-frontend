import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "./queryKeys";
import * as settingsService from "./settingsService";
import type {
  ConnectAdAccountPayload,
  InviteMemberPayload,
  PlanId,
  RemoveAdAccountPayload,
  UpdateMemberPayload,
} from "../types/settings.types";

// ---------- Queries ----------

/** Unified billing overview query (GET /setting/billing/overview) */
export function useBillingOverviewQuery() {
  return useQuery({
    queryKey: settingsKeys.billingOverview(),
    queryFn: settingsService.fetchBillingOverview,
    staleTime: 60 * 1000,
  });
}

export function usePlansQuery() {
  return useQuery({
    queryKey: settingsKeys.plans(),
    queryFn: settingsService.fetchPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentPlanQuery() {
  return useQuery({
    queryKey: settingsKeys.currentPlan(),
    queryFn: settingsService.fetchCurrentPlanSummary,
  });
}

export function useUsageSummaryQuery() {
  return useQuery({
    queryKey: settingsKeys.usage(),
    queryFn: settingsService.fetchUsageSummary,
  });
}

/**
 * Single unified query for all integrations data (Ad accounts & Shopify store).
 * Makes exactly ONE call to GET /setting/integrations/list.
 */
export function useIntegrationsQuery() {
  return useQuery({
    queryKey: settingsKeys.integrations(),
    queryFn: settingsService.fetchIntegrationsOverview,
    staleTime: 60 * 1000,
  });
}

export function useTeamMembersQuery() {
  return useQuery({
    queryKey: settingsKeys.teamMembers(),
    queryFn: settingsService.fetchTeamMembers,
  });
}

// ---------- Mutations ----------

export function useSwitchPlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: PlanId) => settingsService.switchPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.billingOverview() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.currentPlan() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useConnectAdAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConnectAdAccountPayload) => settingsService.connectAdAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useRemoveAdAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveAdAccountPayload) => settingsService.removeAdAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useConnectShopifyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.connectShopify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
}

export function useDisconnectShopifyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.disconnectShopify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
}

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteMemberPayload) => settingsService.inviteMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => settingsService.updateMember(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() }),
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => settingsService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}
