export const settingsKeys = {
  all: ["settings"] as const,
  billingOverview: () => [...settingsKeys.all, "billing-overview"] as const,
  plans: () => [...settingsKeys.all, "plans"] as const,
  currentPlan: () => [...settingsKeys.all, "current-plan"] as const,
  usage: () => [...settingsKeys.all, "usage"] as const,
  integrations: () => [...settingsKeys.all, "integrations"] as const,
  teamMembers: () => [...settingsKeys.all, "team-members"] as const,
  cancelPlan: () => [...settingsKeys.all, "cancel-plan"] as const,
};
