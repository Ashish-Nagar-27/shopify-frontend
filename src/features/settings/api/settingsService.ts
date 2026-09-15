// import { apiClient, simulateNetworkDelay, USE_MOCK_DATA } from "../lib/axiosClient";
import { api } from "@/services/api";
import { mockState } from "../mocks/settingsMockData";
import type {
  AdAccount,
  AdPlatform,
  BillingOverviewResponse,
  ConnectAdAccountPayload,
  CurrentPlanSummary,
  IntegrationsOverviewResponse,
  InviteMemberPayload,
  Plan,
  PlanId,
  RemoveAdAccountPayload,
  ShopifyIntegration,
  TeamMember,
  TeamMembersResponse,
  UpdateMemberPayload,
  UsageSummary,
} from "../types/settings.types";

/**
 * Service layer. Every function has the real axios call ready to go.
 */

// ---------- Plans & current plan ----------

export const simulateNetworkDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const USE_MOCK_DATA = true;

/**
 * Fetches the unified billing overview from GET /setting/billing/overview.
 * Returns available_plans, billing_cycle, current_plan, sessions_usage, and usage_this_cycle.
 */
export async function fetchBillingOverview(): Promise<BillingOverviewResponse> {
  const { data } = await api.get<BillingOverviewResponse>("/setting/billing/overview");
  return data;
}

export async function fetchPlans(): Promise<Plan[]> {
  const overview = await fetchBillingOverview();
  return (overview.available_plans ?? []).map((p) => ({
    id: p.plan_id,
    name: p.plan_name,
    price: `$${p.plan_price}`,
    sessions: p.sessions_included,
    features: p.features,
  }));
}

export async function fetchCurrentPlanSummary(): Promise<CurrentPlanSummary> {
  const overview = await fetchBillingOverview();
  const cp = overview.current_plan;
  return {
    planId: cp?.plan_id,
    name: cp?.plan_name,
    price: cp?.plan_price != null ? `$${cp.plan_price}/mo` : undefined,
    renewalDate: cp?.next_billing_date,
  };
}

export async function fetchUsageSummary(): Promise<UsageSummary> {
  const overview = await fetchBillingOverview();
  return {
    sessions: {
      used: overview.sessions_usage?.sessions_used,
      limit: overview.sessions_usage?.sessions_included,
    },
    adSpendTracked: overview.usage_this_cycle?.ad_spend_tracked,
    adSpendLimit: null,
    connectedAdAccounts: {
      used: overview.usage_this_cycle?.connected_ad_accounts?.count,
      limit: overview.usage_this_cycle?.connected_ad_accounts?.limit,
    },
    teamSeats: {
      used: overview.usage_this_cycle?.team_seats?.used,
      limit: overview.usage_this_cycle?.team_seats?.limit,
    },
  };
}

export async function switchPlan(planId: PlanId): Promise<CurrentPlanSummary> {
  // if (USE_MOCK_DATA) {
  //   await simulateNetworkDelay(400);
  //   mockState.currentPlanId = String(planId);
  //   return getMockCurrentPlanSummary();
  // }
  const { data } = await api.post<CurrentPlanSummary>("/billing/change", { planId });
  return data;
}

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
  // if (USE_MOCK_DATA) {
  //   await simulateNetworkDelay(400);
  //   const label = payload.platform === "google" ? "Google Ads" : "Meta Ads";
  //   const account: AdAccount = {
  //     id: Date.now(),
  //     platform: payload.platform,
  //     name: `${label} Account`,
  //     accountId:
  //       payload.platform === "google"
  //         ? `${400 + Math.floor(Math.random() * 90)}-${100 + Math.floor(Math.random() * 900)}-${
  //             1000 + Math.floor(Math.random() * 9000)
  //           }`
  //         : `act_${Math.floor(1_000_000_000 + Math.random() * 8_999_999_999)}`,
  //     status: "active",
  //   };
  //   mockState.adAccounts.push(account);
  //   return account;
  // }
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

// ---------- Team members / sub-accounts ----------

export async function fetchTeamMembers(): Promise<TeamMembersResponse> {
  // if (USE_MOCK_DATA) {
  //   await simulateNetworkDelay();
  //   return { team_members: mockState.members.map((m) => ({
  //     joined_at: "01 Jan 2026",
  //     last_active_at: "01 Jan 2026",
  //     member_email: m.email,
  //     member_id: Number(m.id),
  //     member_name: m.name,
  //     member_role: m.role.toLowerCase(),
  //     member_status: "active",
  //     was_role_changed: false,
  //   })), total_members: mockState.members.length };
  // }
  const { data } = await api.get<TeamMembersResponse>("/setting/team/members");
  return data;
}

export async function inviteMember(payload: InviteMemberPayload): Promise<TeamMember> {
  // if (USE_MOCK_DATA) {
  //   await simulateNetworkDelay(400);
  //   const member: TeamMember = { id: Date.now(), ...payload };
  //   mockState.members.push(member);
  //   return member;
  // }
  const { data } = await api.post<TeamMember>("/setting/team/invite", payload);
  return data;
}

export async function updateMember(payload: UpdateMemberPayload): Promise<TeamMember> {
  
  const { data } = await api.patch<TeamMember>(`/setting/team/members/${payload.id}`, payload);
  return data;
}

export async function removeMember(id: TeamMember["id"]): Promise<void> {

  return await api.delete(`/setting/team/members/${id}`);
}
