import { ProgressBar } from "../common/ProgressBar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageSummary, UsageThisCycle } from "../../types/settings.types";

interface UsageCardProps {
  usage?: UsageThisCycle | UsageSummary;
  isLoading?: boolean;
}

function formatCurrency(amount?: number) {
  if (typeof amount !== "number") return "—";
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Right card on the Billing tab:
 * Displays ad spend tracked, connected ad accounts, and team seats usage.
 */
export function UsageCard({ usage, isLoading }: UsageCardProps) {
  // Normalize ad spend tracked
  const adSpend =
    usage && "ad_spend_tracked" in usage
      ? usage.ad_spend_tracked
      : (usage as UsageSummary)?.adSpendTracked;

  // Normalize connected ad accounts
  const adAccountsCount =
    usage && "connected_ad_accounts" in usage
      ? usage.connected_ad_accounts.count
      : (usage as UsageSummary)?.connectedAdAccounts?.used ?? 0;

  const adAccountsLimit =
    usage && "connected_ad_accounts" in usage
      ? usage.connected_ad_accounts.limit
      : (usage as UsageSummary)?.connectedAdAccounts?.limit;

  const adAccountsUnlimited =
    usage && "connected_ad_accounts" in usage
      ? usage.connected_ad_accounts.is_unlimited || adAccountsLimit === -1
      : false;

  const adAccountsLimitDisplay = adAccountsUnlimited
    ? "Unlimited"
    : adAccountsLimit != null
      ? adAccountsLimit
      : "—";

  // Normalize team seats
  const teamSeatsUsed =
    usage && "team_seats" in usage
      ? usage.team_seats.used
      : (usage as UsageSummary)?.teamSeats?.used ?? 0;

  const teamSeatsLimit =
    usage && "team_seats" in usage
      ? usage.team_seats.limit
      : (usage as UsageSummary)?.teamSeats?.limit;

  const teamSeatsUnlimited =
    usage && "team_seats" in usage
      ? usage.team_seats.is_unlimited || teamSeatsLimit === -1
      : false;

  const teamSeatsLimitDisplay = teamSeatsUnlimited
    ? "Unlimited"
    : teamSeatsLimit != null
      ? teamSeatsLimit
      : "—";

  return (
    <Card className="gap-0 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-5.5 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_-24px_rgba(0,0,0,0.6)]">
      <div className="mb-4.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-mute)]">
        Usage this cycle
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 rounded bg-[var(--surface-hi)]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4.5">
          <div>
            <div className="mb-2 flex justify-between text-[13px]">
              <span className="text-[var(--fg-dim)]">Ad spend tracked</span>
              <span className="font-[var(--mono)] font-semibold text-[var(--fg)]">
                {formatCurrency(adSpend)}
              </span>
            </div>
            <div className="text-[11px] text-[var(--fg-mute)]">
              No limit on this plan
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-[13px]">
              <span className="text-[var(--fg-dim)]">Connected ad accounts</span>
              <span className="font-[var(--mono)] font-semibold text-[var(--fg)]">
                {adAccountsCount} of {adAccountsLimitDisplay}
              </span>
            </div>
            <ProgressBar
              used={adAccountsCount}
              limit={adAccountsUnlimited ? undefined : adAccountsLimit}
            />
          </div>

          <div>
            <div className="mb-2 flex justify-between text-[13px]">
              <span className="text-[var(--fg-dim)]">Team seats used</span>
              <span className="font-[var(--mono)] font-semibold text-[var(--fg)]">
                {teamSeatsUsed} of {teamSeatsLimitDisplay}
              </span>
            </div>
            <ProgressBar
              used={teamSeatsUsed}
              limit={teamSeatsUnlimited ? undefined : teamSeatsLimit}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
