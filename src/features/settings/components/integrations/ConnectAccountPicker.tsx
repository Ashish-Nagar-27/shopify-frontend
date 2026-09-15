import { Button } from "@/components/ui/button";
import type { AdPlatform } from "../../types/settings.types";

interface ConnectAccountPickerProps {
  googleCount: number;
  metaCount: number;
  perPlatformLimit?: number;
  canAddMore?: boolean;
  onConnect: (platform: AdPlatform) => void;
  onCancel: () => void;
  isConnecting?: boolean;
}

/** Inline picker that replaces the header row when connecting a new ad account. */
export function ConnectAccountPicker({
  googleCount,
  metaCount,
  perPlatformLimit,
  canAddMore = true,
  onConnect,
  onCancel,
  isConnecting,
}: ConnectAccountPickerProps) {
  const googleDisabled = !canAddMore || (perPlatformLimit !== undefined && googleCount >= perPlatformLimit);
  const metaDisabled = !canAddMore || (perPlatformLimit !== undefined && metaCount >= perPlatformLimit);

  const optionClass = (disabled: boolean) =>
    `flex h-auto flex-1 items-center justify-start gap-2.5 rounded-lg border px-3.5 py-3 text-left text-[13px] font-normal shadow-none transition-colors ${
      disabled
        ? "cursor-not-allowed border-[var(--border-soft)] bg-[var(--bg-page)] text-[var(--fg-faint)] opacity-100 hover:bg-[var(--bg-page)] hover:text-[var(--fg-faint)]"
        : "cursor-pointer border-[var(--border-soft)] bg-[var(--surface)] text-[var(--fg)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--fg)]"
    }`;

  return (
    <div className="flex items-center gap-3 border-b border-[var(--border-soft)] px-5.5 py-4">
      <Button
        type="button"
        variant="outline"
        disabled={googleDisabled || isConnecting}
        onClick={() => onConnect("google")}
        className={optionClass(googleDisabled)}
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--cyan)]/[0.18] text-xs font-bold text-[var(--cyan)]">
          G
        </span>
        <span>
          Google Ads · {googleCount}{perPlatformLimit !== undefined ? ` of ${perPlatformLimit}` : ""}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={metaDisabled || isConnecting}
        onClick={() => onConnect("meta")}
        className={optionClass(metaDisabled)}
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--violet)]/[0.18] text-xs font-bold text-[var(--violet)]">
          M
        </span>
        <span>
          Meta Ads · {metaCount}{perPlatformLimit !== undefined ? ` of ${perPlatformLimit}` : ""}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-auto p-0 text-[13px] font-normal text-[var(--fg-mute)] hover:bg-transparent hover:text-[var(--fg-dim)]"
      >
        Cancel
      </Button>
    </div>
  );
}

