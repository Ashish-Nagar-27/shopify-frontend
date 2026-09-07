export const settingsKeys = {
  all: ["settings"] as const,
  plans: () => [...settingsKeys.all, "plans"] as const,
  currentPlan: () => [...settingsKeys.all, "current-plan"] as const,
  usage: () => [...settingsKeys.all, "usage"] as const,
  adAccounts: () => [...settingsKeys.all, "ad-accounts"] as const,
  shopify: () => [...settingsKeys.all, "shopify"] as const,
  teamMembers: () => [...settingsKeys.all, "team-members"] as const,
};
