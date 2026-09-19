/**
 * Shared types for the Settings feature (Billing, Integrations, Sub-accounts).
 *
 * Fields that come back from real APIs are marked optional (`?`) wherever the
 * backend contract isn't 100% guaranteed yet — components must never assume
 * these are present and should fall back gracefully (see the `?.` usage
 * throughout the component tree).
 */

export type SettingsTabId = "billing" | "integrations" | "subaccounts";

export type PlanId = "starter" | "growth" | "scale" | (string & {});

export interface Plan {
  id: PlanId;
  name: string;
  /** Pre-formatted display price, e.g. "₹12,999" */
  price: string;
  /** Sessions included per month, used for computing usage bars */
  sessions?: number;
  features?: string[];
}

export interface CurrentPlanSummary {
  planId?: PlanId;
  name?: string;
  /** Pre-formatted, e.g. "₹12,999/mo" */
  price?: string;
  renewalDate?: string;
}

export interface ChangePlainTypes {
  confirmationUrl: string;
}


export interface UsageMetric {
  used?: number;
  limit?: number;
}

export interface UsageSummary {
  sessions?: UsageMetric & { remainingLabel?: string };
  adSpendTracked?: number;
  adSpendLimit?: number | null;
  connectedAdAccounts?: UsageMetric;
  teamSeats?: UsageMetric;
}

// ---------- Real Billing Overview API Response Types (/setting/billing/overview) ----------

/** Individual available plan item from /setting/billing/overview */
export interface BillingPlanItem {
  action_label: string; // e.g. "Switch plan" | "Current Plan" | "Upgrade"
  action_type: "switch plan" | "current" | "upgrade" | (string & {});
  ad_accounts_included: number; // e.g. 3, 5, 10, or -1 (unlimited)
  features: string[];
  is_current_plan: boolean;
  plan_id: string; // "basic" | "pro" | "advanced" | "enterprise"
  plan_name: string;
  plan_price: number; // e.g. 9.99, 19.99
  sessions_included: number; // e.g. 100000, 500000, or -1 (unlimited)
  team_seats_included: number; // e.g. 3, 10, or -1 (unlimited)
  trial_days?: number;
}

/** Current billing cycle start and end dates */
export interface BillingCycle {
  cycle_start_date: string; // e.g. "15 Oct 2026"
  cycle_end_date: string; // e.g. "14 Nov 2026"
}

/** Detail of the user's active/current plan */
export interface CurrentPlanDetail {
  ad_accounts_included: number;
  next_billing_date: string; // e.g. "14 Nov 2026"
  plan_id: string;
  plan_name: string;
  plan_price: number;
  plan_status: string; // e.g. "active"
  sessions_included: number;
  team_seats_included: number;
}

/** Sessions usage information for the current cycle */
export interface SessionsUsage {
  is_critical: boolean;
  is_unlimited: boolean;
  is_warning: boolean;
  sessions_included: number;
  sessions_used: number;
  usage_percentage: number;
}

/** Connected ad accounts count vs limit */
export interface ConnectedAdAccountsUsage {
  count: number;
  is_unlimited: boolean;
  limit: number;
}

/** Team seats used vs limit */
export interface TeamSeatsUsage {
  is_unlimited: boolean;
  limit: number;
  used: number;
}

/** Overall usage counters for the current cycle */
export interface UsageThisCycle {
  ad_spend_tracked: number;
  connected_ad_accounts: ConnectedAdAccountsUsage;
  team_seats: TeamSeatsUsage;
}

/** Full payload returned by GET /setting/billing/overview */
export interface BillingOverviewResponse {
  available_plans: BillingPlanItem[];
  billing_cycle: BillingCycle;
  current_plan: CurrentPlanDetail;
  sessions_usage: SessionsUsage;
  usage_this_cycle: UsageThisCycle;
}

export type AdPlatform = "google" | "meta" | (string & {});

export type AdAccountStatus = "active" | "error" | "pending" | (string & {});

export interface AdAccount {
  id: string | number;
  platform: AdPlatform;
  name?: string;
  accountId?: string;
  status?: AdAccountStatus;
}

export interface ShopifyIntegration {
  connected: boolean;
  domain?: string;
  plan?: string;
  connectedSince?: string;
}

// ---------- Real Integrations Overview API Response Types (/setting/integrations/list) ----------

/** Individual account record from the backend ad accounts list */
export interface AdAccountApiItem {
  id: number | string;
  account_id: string;
  account_name: string;
}

/** Per-platform accounts grouping */
export interface PlatformAdAccounts {
  accounts: AdAccountApiItem[];
  count: number;
}

/** Overall ad accounts integration summary from GET /setting/integrations/list */
export interface AdAccountsOverview {
  account_limit: number;
  can_add_more: boolean;
  facebook: PlatformAdAccounts;
  google: PlatformAdAccounts;
  is_unlimited: boolean;
  total_connected: number;
}

/** Shopify store integration details from GET /setting/integrations/list */
export interface ShopifyStoreOverview {
  connected_at: string; // e.g. "15 Jan 2026"
  is_connected: boolean;
  store_domain: string; // e.g. "https://loveofindia.myshopify.com"
}

/** Full payload returned by GET /setting/integrations/list */
export interface IntegrationsOverviewResponse {
  ad_accounts: AdAccountsOverview;
  shopify_store: ShopifyStoreOverview;
}

// ---------- Team Members API Response Types (/setting/team/members) ----------

/** Individual team member record from GET /setting/team/members */
export interface TeamMemberApiItem {
  joined_at: string;
  last_active_at: string;
  member_email: string;
  member_id: number | string;
  member_name: string;
  member_role: "admin" | "readonly" | (string & {});
  member_status: "active" | (string & {});
  was_role_changed: boolean;
}

/** Full payload returned by GET /setting/team/members */
export interface TeamMembersResponse {
  team_members: TeamMemberApiItem[];
  total_members: number;
}

export type MemberRole = "admin" | "read_only" | (string & {});

export interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt?: string;
  lastActiveAt?: string;
  status?: string;
}

export interface InviteMemberPayload {
  name: string;
  email: string;
  role: MemberRole;
}

export interface UpdateMemberPayload {
  id: TeamMember["id"];
  name: string;
  email: string;
  role: MemberRole;
}

export interface ConnectAdAccountPayload {
  platform: AdPlatform;
}

export interface RemoveAdAccountPayload {
  id: AdAccount["id"];
  platform: AdPlatform;
}

export type BadgeVariant = "success" | "accent" | "neutral" | "danger";
