import { api } from "@/services/api";
import type {
  BillingOverviewResponse,
  ChangePlainTypes,
  CurrentPlanSummary,
  Plan,
  PlanId,
  UsageSummary,
} from "../types/settings.types";

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

export async function switchPlan(planId: PlanId): Promise<ChangePlainTypes> {
  const { data } = await api.post<ChangePlainTypes>("/api/billing/change-plan", { new_plan_id: planId });
  return data;
}

export async function cancelPlan(): Promise<unknown> {
  const { data } = await api.post("/api/billing/cancel");
  return data;
}
