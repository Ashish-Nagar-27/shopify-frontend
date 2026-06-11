import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { integrationApi } from "../api/integrationApi";
import { DashboardHeader } from "../components/DashboardHeader";
import { ActiveIntegrationCard } from "../components/ActiveIntegrationCard";
import { ConnectShopifyCard } from "../components/ConnectShopifyCard";
import { IntegrationPlaceholder } from "../components/IntegrationPlaceholder";

export function IntegrationPage() {
    const { user, logout } = useAuthStore();
    const [shopDomain, setShopDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPixelEnabled, setIsPixelEnabled] = useState(false);
    const [isWebhookEnabled, setIsWebhookEnabled] = useState(false);

    const { data: embedStatus } = useQuery({
        queryKey: ["embedStatus"],
        queryFn: integrationApi.getEmbedStatus,
        enabled: !!user?.isConnected,
    });

    const togglePixelMutation = useMutation({
        mutationFn: integrationApi.togglePixel,
    });

    const toggleWebhookMutation = useMutation({
        mutationFn: integrationApi.toggleWebhook,
    });

    function handleTogglePixel(checked: boolean) {
        setIsPixelEnabled(checked);
        togglePixelMutation.mutate(checked);
    }

    function handleToggleWebhook(checked: boolean) {
        setIsWebhookEnabled(checked);
        toggleWebhookMutation.mutate(checked);
    }

    async function handleConnectShopify() {
        if (!shopDomain.trim()) {
            setError("Please enter your Shopify store domain");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await integrationApi.connectShopify(shopDomain);
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Connection initiated (Mock response)");
            }
        } catch (err) {
            console.error("Failed to connect shopify:", err);
            setError("Failed to initiate connection. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-svh bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* <DashboardHeader
                userName={user?.name}
                userEmail={user?.email}
                onLogout={logout}
            /> */}

            <main className="mx-auto max-w-5xl px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Integrations
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Connect your store to get started with powerful analytics and
                        tracking.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {!user?.isConnected ? (
                        <ActiveIntegrationCard
                            isPixelEnabled={isPixelEnabled}
                            isWebhookEnabled={isWebhookEnabled}
                            isPixelPending={togglePixelMutation.isPending}
                            isWebhookPending={toggleWebhookMutation.isPending}
                            embedStatus={embedStatus}
                            onTogglePixel={handleTogglePixel}
                            onToggleWebhook={handleToggleWebhook}
                        />
                    ) : (
                        <ConnectShopifyCard
                            shopDomain={shopDomain}
                            onShopDomainChange={setShopDomain}
                            isLoading={isLoading}
                            error={error}
                            onConnect={handleConnectShopify}
                        />
                    )}

                    <IntegrationPlaceholder />
                </div>
            </main>
        </div>
    );
}
