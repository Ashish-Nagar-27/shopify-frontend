import { useState, useMemo } from "react";
import {
  useConnectAdAccountMutation,
  useRemoveAdAccountMutation,
} from "../../api/useSettingsQueries";
import { toast } from "sonner";
import { AdAccountRow } from "./AdAccountRow";
import { ConnectAccountPicker } from "./ConnectAccountPicker";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdAccount, AdAccountsOverview, AdPlatform } from "../../types/settings.types";
import { useGoogleAuth } from "@/features/Onboarding/hooks/useGoogleAuth";
import { useMetaAuth } from "@/features/Onboarding/hooks/useMetaAuth";

interface AdAccountsCardProps {
  /** Real overview data returned by GET /setting/integrations/list */
  adAccounts?: AdAccountsOverview;
  isLoading?: boolean;
}

const DEFAULT_TOTAL_LIMIT = 5;
const DEFAULT_PER_PLATFORM_LIMIT = 3;

export function AdAccountsCard({ adAccounts, isLoading = false }: AdAccountsCardProps) {
  const connectMutation = useConnectAdAccountMutation();
  const removeMutation = useRemoveAdAccountMutation();
  const [showPicker, setShowPicker] = useState(false);

  // -------------------------------
  // -------------------------------

  const [googleAccountsConnected, setGoogleAccountsConnected] = useState(false);
  const [metaAccountsConnected, setMetaAccountsConnected] = useState(false);
  const [googleAccountsConnecting, setGoogleAccountsConnecting] = useState(false);
  const [metaAccountsConnecting, setMetaAccountsConnecting] = useState(false);



  const {
    connectGoogleAds,
    extractedAccounts: googleAccounts,
    isModalOpen: isGoogleModalOpen,
    closeModal: closeGoogleModal,
    handleAccountsSubmit: handleGoogleAccountsSubmit
  } = useGoogleAuth({ setConnectingGoogle: setGoogleAccountsConnecting, setGoogleConnected: setGoogleAccountsConnected });

  const {
    connectMetaAds,
    extractedAccounts: metaAccounts,
    isModalOpen: isMetaModalOpen,
    closeModal: closeMetaModal,
    handleAccountsSubmit: handleMetaAccountsSubmit
  } = useMetaAuth({ setConnectingMeta: setMetaAccountsConnecting, setMetaConnected: setMetaAccountsConnected });


  // -------------------------------
  // -------------------------------

  const handleConnect = (platform: AdPlatform) => {
    // connectMutation.mutate(
    //   { platform },
    //   {
    //     onSuccess: () => {
    //       setShowPicker(false);
    //       showToast(`${platform === "google" ? "Google Ads" : "Meta Ads"} connected`, "success");
    //     },
    //     onError: (err) => showToast(err instanceof Error ? err.message : "Could not connect account", "error"),
    //   }
    // );
    platform === "google" ? connectGoogleAds() : connectMetaAds();
  };

  // Normalize ad accounts list from API overview
  const list: AdAccount[] = useMemo(() => {
    if (!adAccounts) return [];
    const fbAccounts: AdAccount[] = (adAccounts.facebook?.accounts ?? []).map((acc) => ({
      id: acc.id,
      platform: "meta",
      name: acc.account_name,
      accountId: acc.account_id,
      status: "active",
    }));
    const googleAccounts: AdAccount[] = (adAccounts.google?.accounts ?? []).map((acc) => ({
      id: acc.id,
      platform: "google",
      name: acc.account_name,
      accountId: acc.account_id,
      status: "active",
    }));
    return [...fbAccounts, ...googleAccounts];
  }, [adAccounts]);

  // Dynamic counts & limits from API overview
  const totalConnected = adAccounts?.total_connected ?? list.length;
  const isUnlimited = adAccounts?.is_unlimited ?? false;
  const accountLimit = adAccounts?.account_limit ?? DEFAULT_TOTAL_LIMIT;
  const canAddMore = adAccounts ? adAccounts.can_add_more : list.length < DEFAULT_TOTAL_LIMIT;

  const googleCount = adAccounts?.google?.count ?? list.filter((a) => a.platform === "google").length;
  const metaCount =
    adAccounts?.facebook?.count ??
    list.filter((a) => a.platform === "meta" || a.platform === "facebook").length;

      


  const handleRemove = (id: AdAccount["id"], platform: AdPlatform) => {
    removeMutation.mutate(
      { id, platform },
      {
        onSuccess: () => toast.success("Account removed"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove account"),
      }
    );
  };

  const connectedLabel = isUnlimited
    ? `${totalConnected} connected`
    : `${totalConnected} of ${accountLimit} connected`;

  return (
    <Card className="gap-0 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] py-0 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_-24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5.5 py-5">
        <div>
          <CardTitle className="text-[15px] font-semibold text-[var(--fg)]">Ad accounts</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-[var(--fg-mute)]">
            Connect Google or Meta ad accounts to pull performance data into Pumalyze.
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-[var(--mono)] text-xs text-[var(--fg-mute)]">
            {connectedLabel}
          </span>
          <Button
            type="button"
            disabled={!canAddMore}
            onClick={() => setShowPicker((v) => !v)}
            className={`h-9 rounded-lg px-4 text-[13px] font-semibold shadow-none ${
              !canAddMore
                ? "cursor-not-allowed bg-[var(--surface-2)] text-[var(--fg-faint)] opacity-100 hover:bg-[var(--surface-2)] hover:text-[var(--fg-faint)]"
                : "bg-[image:var(--gradient-accent)] text-[var(--text-on-accent)] hover:opacity-90"
            }`}
          >
            + Connect account
          </Button>
        </div>
      </div>

      {showPicker && (
        <ConnectAccountPicker
          googleCount={googleCount}
          metaCount={metaCount}
          perPlatformLimit={adAccounts ? adAccounts.account_limit : DEFAULT_PER_PLATFORM_LIMIT}
          canAddMore={canAddMore}
          onConnect={handleConnect}
          onCancel={() => setShowPicker(false)}
          isConnecting={connectMutation.isPending}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3 p-5.5">
          <Skeleton className="h-9 w-full bg-[var(--surface-hi)]" />
          <Skeleton className="h-9 w-full bg-[var(--surface-hi)]" />
        </div>
      ) : list.length === 0 ? (
        <div className="p-5.5 text-sm text-[var(--fg-mute)]">No ad accounts connected yet.</div>
      ) : (
        list.map((account) => (
          <AdAccountRow
            key={account.id}
            account={account}
            onRemove={handleRemove}
            isRemoving={removeMutation.isPending && removeMutation.variables?.id === account.id}
          />
        ))
      )}
    </Card>
  );
}
