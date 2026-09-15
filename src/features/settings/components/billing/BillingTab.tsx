import {
  useBillingOverviewQuery,
  useSwitchPlanMutation,
} from "../../api/useSettingsQueries";
import { CurrentPlanCard } from "./CurrentPlanCard";
import { UsageCard } from "./UsageCard";
import { PlanCard } from "./PlanCard";
import { toast } from "sonner";

/**
 * BillingTab displays:
 * 1. Current Plan summary with renewal date and session usage meter.
 * 2. Cycle Usage summary (ad spend tracked, ad accounts, team seats).
 * 3. Available plans grid with switch/upgrade action triggers.
 *
 * All billing information is retrieved in a single unified request via GET /setting/billing/overview.
 */
export function BillingTab() {
  const { data: overview, isLoading } = useBillingOverviewQuery();
  const switchPlanMutation = useSwitchPlanMutation();

  const currentPlanId = overview?.current_plan?.plan_id;

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlanId) return;

    const targetPlan = overview?.available_plans?.find((p) => p.plan_id === planId);
    const planName = targetPlan?.plan_name ?? "plan";
    const isUpgrade = targetPlan?.action_type === "upgrade";

    switchPlanMutation.mutate(planId, {
      onSuccess: () =>
        toast.success(`${isUpgrade ? "Upgraded to" : "Switched to"} ${planName}`),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not switch plan"),
    });
  };

  return (
    <div>
      {/* Top row: Current active plan details and cycle usage metrics */}
      <div className="grid items-stretch gap-5 [grid-template-columns:minmax(280px,380px)_1fr]">
        <CurrentPlanCard
          plan={overview?.current_plan}
          sessions={overview?.sessions_usage}
          isLoading={isLoading}
        />
        <UsageCard
          usage={overview?.usage_this_cycle}
          isLoading={isLoading}
        />
      </div>

      {/* Bottom section: Available plans catalog */}
      <div id="plans" className="mt-7">
        <div className="mb-1 text-[15px] font-semibold text-[var(--fg)]">Available plans</div>
        <div className="mb-4 text-[13px] text-[var(--fg-mute)]">
          Upgrade or switch plans anytime — changes apply at your next billing cycle.
        </div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {(overview?.available_plans ?? []).map((plan) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              onSelect={handleSelectPlan}
              isPending={
                switchPlanMutation.isPending && switchPlanMutation.variables === plan.plan_id
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
