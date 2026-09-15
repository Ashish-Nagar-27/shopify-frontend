import type {
  AdAccount,
  CurrentPlanSummary,
  Plan,
  ShopifyIntegration,
  TeamMember,
  UsageSummary,
} from "../types/settings.types";

/**
 * In-memory mock store. Mutated by services/settingsService.ts while
 * VITE_USE_MOCK is on, so the UI behaves like a real backend during
 * development (optimistic-looking reads after writes) without needing a
 * server. Swap the service functions to real axios calls later — the
 * component tree and react-query hooks won't need to change.
 */

export const PLAN_DEFS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹4,999",
    sessions: 50_000,
    features: ["50,000 sessions/mo", "1 ad account", "2 team seats", "Core reporting"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹12,999",
    sessions: 250_000,
    features: [
      "250,000 sessions/mo",
      "3 ad accounts",
      "5 team seats",
      "Creative insights",
      "Funnel analysis",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: "₹29,999",
    sessions: 1_000_000,
    features: [
      "1,000,000 sessions/mo",
      "10 ad accounts",
      "Unlimited team seats",
      "Dedicated account manager",
    ],
  },
];

export const PLAN_RANK: Record<string, number> = { starter: 0, growth: 1, scale: 2 };

export const mockState: {
  currentPlanId: string;
  sessionsUsed: number;
  adSpendTracked: number;
  adAccountsLimit: number;
  adAccounts: AdAccount[];
  shopify: ShopifyIntegration;
  members: TeamMember[];
} = {
  currentPlanId: "growth",
  sessionsUsed: 168_420,
  adSpendTracked: 745_301,
  adAccountsLimit: 6,
  adAccounts: [
    { id: 1, platform: "google", name: "Pumalyze Demo — Search", accountId: "453-221-8890", status: "active" },
    { id: 2, platform: "meta", name: "Pumalyze Demo — Ads Manager", accountId: "act_9284710233", status: "active" },
  ],
  shopify: {
    connected: true,
    domain: "pumalyze-demo.myshopify.com",
    plan: "Shopify Basic",
    connectedSince: "Jan 2025",
  },
  members: [
    { id: 1, name: "Ravi Shah", email: "ravi@pumalyze.com", role: "Admin" },
    { id: 2, name: "Meera Iyer", email: "meera@brandco.in", role: "Read-only" },
    { id: 3, name: "Dev Patel", email: "dev@brandco.in", role: "Admin" },
  ],
};

export function getMockCurrentPlanSummary(): CurrentPlanSummary {
  const plan = PLAN_DEFS.find((p) => p.id === mockState.currentPlanId) ?? PLAN_DEFS[1];
  return {
    planId: plan.id,
    name: plan.name,
    price: `${plan.price}/mo`,
    renewalDate: "20 Sep 2026",
  };
}

export function getMockUsageSummary(): UsageSummary {
  const plan = PLAN_DEFS.find((p) => p.id === mockState.currentPlanId) ?? PLAN_DEFS[1];
  const seatsLimit = plan.id === "starter" ? 2 : plan.id === "growth" ? 5 : Math.max(mockState.members.length, 5);
  return {
    sessions: {
      used: mockState.sessionsUsed,
      limit: plan.sessions ?? 0,
    },
    adSpendTracked: mockState.adSpendTracked,
    adSpendLimit: null,
    connectedAdAccounts: { used: mockState.adAccounts.length, limit: 3 },
    teamSeats: { used: mockState.members.length, limit: seatsLimit },
  };
}
