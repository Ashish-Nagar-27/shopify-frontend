import { ProgressBar } from "../common/ProgressBar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCancelPlanMutation } from "../../hooks";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type {
  CurrentPlanDetail,
  CurrentPlanSummary,
  SessionsUsage,
  UsageMetric,
} from "../../types/settings.types";

interface CurrentPlanCardProps {
  plan?: CurrentPlanDetail | CurrentPlanSummary;
  sessions?: SessionsUsage | UsageMetric;
  isLoading?: boolean;
}

/**
 * Left card on the Billing tab:
 * Displays active plan name, price, next billing/renewal date, and session usage.
 */
export function CurrentPlanCard({ plan, sessions, isLoading }: CurrentPlanCardProps) {
  // Normalize plan fields between API response (snake_case) and legacy types (camelCase)
  const planName =
    (plan && "plan_name" in plan ? plan.plan_name : (plan as CurrentPlanSummary)?.name) ?? "—";

  const rawPrice =
    plan && "plan_price" in plan ? plan.plan_price : (plan as CurrentPlanSummary)?.price;
  const formattedPrice =
    typeof rawPrice === "number" ? `$${rawPrice}/mo` : (rawPrice ?? "");

  const renewalDate =
    plan && "next_billing_date" in plan
      ? plan.next_billing_date
      : (plan as CurrentPlanSummary)?.renewalDate;

  // Normalize session usage fields
  const isUnlimited =
    sessions && "is_unlimited" in sessions ? Boolean(sessions.is_unlimited) : false;
  const used =
    sessions && "sessions_used" in sessions
      ? sessions.sessions_used
      : (sessions as UsageMetric)?.used;
  const limit =
    sessions && "sessions_included" in sessions
      ? sessions.sessions_included
      : (sessions as UsageMetric)?.limit;

  const isLimitUnlimited = isUnlimited || limit === -1;
  const limitDisplay = isLimitUnlimited ? "Unlimited" : (limit?.toLocaleString("en-IN") ?? "—");
  const usedDisplay = used != null ? used.toLocaleString("en-IN") : "0";

  const remaining =
    typeof used === "number" && typeof limit === "number" && !isLimitUnlimited
      ? Math.max(0, limit - used)
      : undefined;

  const cancelPlanMutation = useCancelPlanMutation();

  const handleCancelPlan = () => {
    cancelPlanMutation.mutate(undefined, {
      onSuccess: () => toast.success("Plan cancelled successfully"),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Could not cancel plan"),
    });
  };

  return (
    <Card className="gap-4.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5.5 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_-24px_rgba(0,0,0,0.6)]">
      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-mute)]">
          Current plan
        </div>
        {isLoading ? (
          <Skeleton className="h-7 w-32 bg-[var(--surface-hi)]" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--fg)]">
              {planName}
            </span>
            <span className="font-[var(--mono)] text-[13px] text-[var(--fg-mute)]">
              {formattedPrice}
            </span>
          </div>
        )}
        <div className="mt-1.5 text-xs text-[var(--fg-mute)]">
          {renewalDate ? `Renews on ${renewalDate}` : "\u00A0"}
        </div>
      </div>

      <Separator className="bg-[var(--border-soft)]" />

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] text-[var(--fg-dim)]">Sessions included</span>
          <span className="font-[var(--mono)] text-[13px] font-semibold text-[var(--fg)]">
            {usedDisplay} of {limitDisplay}
          </span>
        </div>
        <ProgressBar used={used} limit={isLimitUnlimited ? undefined : limit} />
        {isLimitUnlimited ? (
          <div className="mt-2 text-[11px] text-[var(--fg-mute)]">
            Unlimited sessions this cycle
          </div>
        ) : remaining !== undefined ? (
          <div className="mt-2 text-[11px] text-[var(--fg-mute)]">
            {remaining.toLocaleString("en-IN")} sessions left this cycle
          </div>
        ) : null}
      </div>
      <div className="flex justify-between">

        <a
          href="#plans"
          className="mt-auto text-[13px] text-[var(--cyan)] hover:underline"
        >
          See all plans below ↓
        </a>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={cancelPlanMutation.isPending}
              type="button"
              className="h-8 shrink-0 whitespace-nowrap px-[14px] rounded-lg border border-[oklch(0.24_0.022_235)] bg-transparent text-[oklch(0.72_0.02_235)] text-xs font-medium font-inherit cursor-pointer hover:border-[oklch(0.7_0.2_25_/_0.5)] hover:text-[oklch(0.7_0.2_25)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelPlanMutation.isPending ? "Cancelling..." : "Cancel plan"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Plan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription? Your plan will not get renewed anymore.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Plan</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleCancelPlan}
              >
                Confirm Cancellation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </Card>
  );
}
