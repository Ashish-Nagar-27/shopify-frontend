import { useState } from "react";
import { Avatar } from "../common/Avatar";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmInline } from "../common/ConfirmInline";
import { Button } from "@/components/ui/button";
import type { AdAccount, AdPlatform } from "../../types/settings.types";

interface AdAccountRowProps {
  account: AdAccount;
  onRemove: (id: AdAccount["id"], platform: AdPlatform) => void;
  isRemoving?: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
  facebook: "Meta Ads",
};

const PLATFORM_COLORS: Record<string, string> = {
  google: "bg-[var(--cyan)]/[0.18] text-[var(--cyan)]",
  meta: "bg-[var(--violet)]/[0.18] text-[var(--violet)]",
  facebook: "bg-[var(--violet)]/[0.18] text-[var(--violet)]",
};

/** One row inside the "Ad accounts" card — handles its own remove UI state. */
export function AdAccountRow({ account, onRemove, isRemoving }: AdAccountRowProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const platformLabel = PLATFORM_LABELS[account.platform] ?? account.platform ?? "Ad account";
  const badgeColor = PLATFORM_COLORS[account.platform] ?? "bg-[var(--surface-2)] text-[var(--fg-mute)]";
  const avatarChar =
    account.platform === "meta" || account.platform === "facebook"
      ? "M"
      : account.platform?.charAt(0).toUpperCase() || "A";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5.5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar label={avatarChar} colorClassName={badgeColor} />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-[var(--fg)]">
            {account.name ?? "Untitled account"}
          </div>
          <div className="mt-0.5 font-[var(--mono)] text-[11px] text-[var(--fg-mute)]">
            {platformLabel}
            {account.accountId ? ` · ${account.accountId}` : ""}
          </div>
        </div>
      </div>

      <div className="flex flex-none items-center gap-2">
        {confirmingRemove ? (
          <ConfirmInline
            question="Remove this account?"
            onCancel={() => setConfirmingRemove(false)}
            onConfirm={() => onRemove(account.id, account.platform)}
            isPending={isRemoving}
          />
        ) : (
          <>
            {account.status && (
              <StatusBadge
                label={account.status}
                variant={account.status === "active" ? "success" : "neutral"}
                uppercase
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingRemove(true)}
              className="h-[30px] rounded-[7px] bg-transparent px-3 text-xs text-[var(--neg)] hover:bg-[var(--neg)]/[0.1] hover:text-[var(--neg)]"
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
