import { useState } from "react";
import { Avatar } from "../common/Avatar";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmInline } from "../common/ConfirmInline";
import {
  useConnectShopifyMutation,
  useDisconnectShopifyMutation,
} from "../../hooks";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShopifyStoreOverview } from "../../types/settings.types";
import { toast } from "sonner";
import useShopifyIntegration from "@/hooks/useShopifyIntegration";

interface ShopifyCardProps {
  /** Real store integration overview returned by GET /setting/integrations/list */
  shopifyStore?: ShopifyStoreOverview;
  isLoading?: boolean;
}

export function ShopifyCard({ shopifyStore, isLoading = false }: ShopifyCardProps) {
  const connectMutation = useConnectShopifyMutation();
  const disconnectMutation = useDisconnectShopifyMutation();
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);

  // Normalize connection state and domain from real API overview
  const isConnected = Boolean(shopifyStore?.is_connected);
  const rawDomain = shopifyStore?.store_domain ?? "";
  const displayDomain = rawDomain ? rawDomain.replace(/^https?:\/\//, "") : "—";
  const connectedDate = shopifyStore?.connected_at;
  const planLabel = "Shopify";

  const { handleConnectShopify } = useShopifyIntegration();

  const handleConnect = () => {
    connectMutation.mutate(undefined, {
      onSuccess: () => toast.success("Shopify connected"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Could not connect Shopify"),
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmingDisconnect(false);
        toast.success("Shopify disconnected");
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Could not disconnect Shopify"),
    });
  };

  return (
    <Card className="gap-0 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] py-0 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_-24px_rgba(0,0,0,0.6)]">
      <div className="border-b border-[var(--border-soft)] px-5.5 py-5">
        <CardTitle className="text-[15px] font-semibold text-[var(--fg)]">Shopify store</CardTitle>
        <CardDescription className="mt-0.5 text-xs text-[var(--fg-mute)]">
          Sync orders and revenue from your Shopify store.
        </CardDescription>
      </div>

      {isLoading ? (
        <div className="p-5.5">
          <Skeleton className="h-10 w-48 bg-[var(--surface-hi)]" />
        </div>
      ) : isConnected ? (
        <div className="flex items-center justify-between gap-4 px-5.5 py-4.5">
          <div className="flex items-center gap-3">
            <Avatar
              label="S"
              colorClassName="bg-[var(--pos)]/[0.16] text-[var(--pos)]"
            />
            <div>
              <div className="text-[13px] font-medium text-[var(--fg)]">
                {displayDomain}
              </div>
              <div className="mt-0.5 font-[var(--mono)] text-[11px] text-[var(--fg-mute)]">
                {planLabel}
                {connectedDate ? ` · connected since ${connectedDate}` : ""}
              </div>
            </div>
          </div>

          {confirmingDisconnect ? (
            <ConfirmInline
              question="Disconnect Shopify?"
              confirmLabel="Disconnect"
              onCancel={() => setConfirmingDisconnect(false)}
              onConfirm={handleDisconnect}
              isPending={disconnectMutation.isPending}
            />
          ) : (
            <div className="flex items-center gap-2">
              <StatusBadge label="Connected" variant="success" uppercase  />
              {/* <Button
                type="button"
                variant="ghost"
                size="sm"
                // onClick={() => setConfirmingDisconnect(true)}
                onClick={() => toast.error("Not Connected", )}
                className="h-[30px] rounded-[7px] bg-transparent px-3 text-xs text-[var(--neg)] hover:bg-[var(--neg)]/[0.1] hover:text-[var(--neg)]"
              >
                Disconnect
              </Button> */}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 px-5.5 py-4.5">
          <div className="text-[13px] text-[var(--fg-dim)]">Not connected.</div>
          <Button
            type="button"
            onClick={() => handleConnectShopify("settings")}
            disabled={connectMutation.isPending}
            className="h-9 rounded-lg bg-[image:var(--gradient-accent)] px-4 text-[13px] font-semibold text-[var(--text-on-accent)] shadow-none hover:opacity-90 disabled:opacity-60"
          >
            {connectMutation.isPending ? "Connecting…" : "Connect Shopify"}
          </Button>
        </div>
      )}
    </Card>
  );
}
