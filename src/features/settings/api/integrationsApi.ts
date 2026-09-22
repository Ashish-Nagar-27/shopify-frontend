import { api } from "@/services/api";
import { mockState } from "../mocks/settingsMockData";
import type {
  AdAccount,
  AdPlatform,
  ConnectAdAccountPayload,
  IntegrationsOverviewResponse,
  RemoveAdAccountPayload,
  ShopifyIntegration,
} from "../types/settings.types";

export const simulateNetworkDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const USE_MOCK_DATA = true;

// ---------- Ad account & Shopify integrations ----------

/**
 * Fetches the unified integrations list from GET /setting/integrations/list.
 * Returns ad_accounts (Facebook, Google) and shopify_store details.
 * This is the single source of truth for the Integrations tab.
 */
export async function fetchIntegrationsOverview(): Promise<IntegrationsOverviewResponse> {
  const { data } = await api.get<IntegrationsOverviewResponse>("/setting/integrations/list");
  return data;
}

/**
 * Pure utility function to transform an IntegrationsOverviewResponse into a flat AdAccount[] list.
 * Performs NO network requests.
 */
export function extractAdAccountsFromOverview(overview?: IntegrationsOverviewResponse): AdAccount[] {
  if (!overview?.ad_accounts) return [];
  const fbAccounts: AdAccount[] = (overview.ad_accounts.facebook?.accounts ?? []).map((acc) => ({
    id: acc.id,
    platform: "meta",
    name: acc.account_name,
    accountId: acc.account_id,
    status: "active",
  }));
  const googleAccounts: AdAccount[] = (overview.ad_accounts.google?.accounts ?? []).map((acc) => ({
    id: acc.id,
    platform: "google",
    name: acc.account_name,
    accountId: acc.account_id,
    status: "active",
  }));
  return [...fbAccounts, ...googleAccounts];
}

export async function connectAdAccount(payload: ConnectAdAccountPayload): Promise<AdAccount> {
  const { data } = await api.post<AdAccount>("/setting/integrations/facebook/add", payload);
  return data;
}

export async function removeAdAccount(
  payload: RemoveAdAccountPayload | AdAccount["id"],
  platform?: AdPlatform
): Promise<void> {
  const id = typeof payload === "object" ? payload.id : payload;
  const plat = typeof payload === "object" ? payload.platform : platform;
  const platformPath = plat?.toLowerCase() === "google" ? "google" : "facebook";
  await api.delete(`/setting/integrations/${platformPath}/${id}`);
}

// ---------- Shopify integration ----------

export async function connectShopify(): Promise<ShopifyIntegration> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay(400);
    mockState.shopify = { ...mockState.shopify, connected: true };
    return mockState.shopify;
  }
  const { data } = await api.post<ShopifyIntegration>("/settings/integrations/shopify/connect");
  return data;
}

export async function disconnectShopify(): Promise<ShopifyIntegration> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay(400);
    mockState.shopify = { ...mockState.shopify, connected: false };
    return mockState.shopify;
  }
  const { data } = await api.post<ShopifyIntegration>("/settings/integrations/shopify/disconnect");
  return data;
}
