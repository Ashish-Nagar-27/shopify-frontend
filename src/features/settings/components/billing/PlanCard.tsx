
import type { BillingPlanItem, Plan } from "../../types/settings.types";
import { CheckIcon } from "../icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanCardSkeleton({ className }: { className?: string } = {}) {
  return (
    <Card
      className={`relative flex flex-col gap-0 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5.5 text-inherit shadow-none ${
        className ?? ""
      }`}
    >
      <Skeleton className="mb-2 h-5 w-28 bg-[var(--surface-hi)]" />
      <div className="mb-4 flex items-baseline gap-1.5">
        <Skeleton className="h-8 w-20 bg-[var(--surface-hi)]" />
        <Skeleton className="h-3.5 w-7 bg-[var(--surface-hi)]" />
      </div>

      <div className="mb-5 flex flex-1 flex-col gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--surface-hi)]" />
            <Skeleton
              className="h-3.5 bg-[var(--surface-hi)]"
              style={{ width: `${65 + ((i * 11) % 25)}%` }}
            />
          </div>
        ))}
      </div>

      <Skeleton className="h-[38px] w-full rounded-lg bg-[var(--surface-hi)]" />
    </Card>
  );
}

interface PlanCardProps {
  plan?: BillingPlanItem | Plan;
  /** Optional override; automatically inferred if using BillingPlanItem */
  isCurrent?: boolean;
  /** Optional override; automatically inferred if using BillingPlanItem */
  isUpgrade?: boolean;
  onSelect?: (planId: string) => void;
  isPending?: boolean;
  isLoading?: boolean;
}

/**
 * Reusable plan card — renders differently for current / upgrade / switch states.
 * Supports both the real API payload (BillingPlanItem) and local Plan definition.
 */
export function PlanCard({
  plan,
  isCurrent: propIsCurrent,
  isUpgrade: propIsUpgrade,
  onSelect,
  isPending,
  isLoading,
}: PlanCardProps) {
  if (isLoading || !plan) {
    return <PlanCardSkeleton />;
  }
  // Normalize plan fields between API response (snake_case) and legacy types (camelCase)
  const isCurrent =
    "is_current_plan" in plan
      ? Boolean(plan.is_current_plan)
      : (propIsCurrent ?? false);

  const isUpgrade =
    "action_type" in plan
      ? plan.action_type === "upgrade"
      : (propIsUpgrade ?? false);

  const ctaLabel =
    ("action_label" in plan ? plan.action_label : undefined) ||
    (isCurrent ? "Current plan" : isUpgrade ? "Upgrade" : "Switch plan");

  const planName = "plan_name" in plan ? plan.plan_name : plan.name;
  const rawPrice = "plan_price" in plan ? plan.plan_price : plan.price;
  const displayPrice = typeof rawPrice === "number" ? `$${rawPrice}` : rawPrice;
  const planId = "plan_id" in plan ? plan.plan_id : plan.id;

  return (
    <Card
      className={`relative flex flex-col gap-0 rounded-xl border p-5.5 text-inherit shadow-none ${
        isCurrent
          ? "border-[var(--cyan)]/50 bg-[var(--surface-2)]"
          : "border-[var(--border-soft)] bg-[var(--surface)]"
      }`}
    >
      {isCurrent && (
        <Badge
          variant="outline"
          className="absolute right-4 top-4 rounded-full border-transparent bg-[var(--cyan)]/[0.16] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--cyan)] shadow-none"
        >
          Current
        </Badge>
      )}

      <div className="mb-1 text-base font-semibold text-[var(--fg)]">{planName}</div>
      <div className="mb-4 flex items-baseline gap-1">
        <span className="font-[var(--mono)] text-2xl font-semibold text-[var(--fg)]">
          {displayPrice}
        </span>
        <span className="text-xs text-[var(--fg-mute)]">/mo</span>
      </div>

      <div className="mb-5 flex flex-1 flex-col gap-2.5">
        {(plan.features ?? []).map((feature) => (
          <div key={feature} className="flex items-start gap-2 text-[13px] text-[var(--fg-dim)]">
            <CheckIcon className="mt-0.5 flex-none text-[var(--cyan)]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        disabled={isCurrent || isPending}
        onClick={() => onSelect?.(planId)}
        className={`h-[38px] rounded-lg text-[13px] font-semibold shadow-none transition-opacity disabled:cursor-default ${
          isCurrent
            ? "border border-[var(--border-soft)] bg-transparent text-[var(--fg-faint)] opacity-100 hover:bg-transparent hover:text-[var(--fg-faint)]"
            : isUpgrade
              ? "bg-[image:var(--gradient-accent)] text-[var(--text-on-accent)] hover:opacity-90"
              : "border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:opacity-90"
        }`}
      >
        {isPending ? "Please wait…" : ctaLabel}
      </Button>
    </Card>
  );
}

PlanCard.Skeleton = PlanCardSkeleton;

