import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "../api/queryKeys";
import * as integrationsApi from "../api/integrationsApi";
import type {
  ConnectAdAccountPayload,
  RemoveAdAccountPayload,
} from "../types/settings.types";

/**
 * Single unified query for all integrations data (Ad accounts & Shopify store).
 * Makes exactly ONE call to GET /setting/integrations/list.
 */
export function useIntegrationsQuery() {
  return useQuery({
    queryKey: settingsKeys.integrations(),
    queryFn: integrationsApi.fetchIntegrationsOverview,
    staleTime: 60 * 1000,
  });
}

export function useConnectAdAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConnectAdAccountPayload) => integrationsApi.connectAdAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useRemoveAdAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveAdAccountPayload) => integrationsApi.removeAdAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useConnectShopifyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsApi.connectShopify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
}

export function useDisconnectShopifyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsApi.disconnectShopify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
}
