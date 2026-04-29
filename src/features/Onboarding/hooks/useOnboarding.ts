import { useState } from "react";

import { onboardingApi } from "../api/onboardingApi";
import type { UseOnboardingReturn } from "../types/onboarding.types";

export function useOnboarding(): UseOnboardingReturn {
    const [step, setStep] = useState(1);
    const [shopifyConnected, setShopifyConnected] = useState(true);
    const [connectingShopify, setConnectingShopify] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [metaConnected, setMetaConnected] = useState(false);
    const [connectingGoogle, setConnectingGoogle] = useState(false);
    const [connectingMeta, setConnectingMeta] = useState(false);
    const [utmApplied, setUtmApplied] = useState<Record<string, boolean>>({
        google: false,
        meta: false,
    });
    const [animating, setAnimating] = useState(false);
    const [shopDomain, setShopDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPixelEnabled, setIsPixelEnabled] = useState(false);
    const [isWebhookEnabled, setIsWebhookEnabled] = useState(false);
    const [billingPlan, setBillingPlan] = useState<string | null>(null);


    const connectedChannels: string[] = [];
    if (googleConnected) connectedChannels.push("google");
    if (metaConnected) connectedChannels.push("meta");

    const canNext = () => {
        if (step === 1) return true;
        if (step === 2) return shopifyConnected;
        if (step === 3) return billingPlan !== null;
        if (step === 4) return connectedChannels.length > 0;
        if (step === 5) return connectedChannels.some((c) => utmApplied[c]);
        return false;
    };

    const goTo = (dir: "next" | "prev") => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setStep((s) => s + (dir === "next" ? 1 : -1));
            setTimeout(() => setAnimating(false), 30);
        }, 260);
    };

    const simulateConnect = (
        setter: (v: boolean) => void,
        loadingSetter: (v: boolean) => void
    ) => {
        loadingSetter(true);
        setTimeout(() => {
            loadingSetter(false);
            setter(true);
        }, 1600);
    };

    async function handleConnectShopify() {
        if (!shopDomain.trim()) {
            setError("Please enter your Shopify store domain");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await onboardingApi.connectShopify(shopDomain);
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

    return {
        step,
        shopifyConnected,
        connectingShopify,
        googleConnected,
        metaConnected,
        connectingGoogle,
        connectingMeta,
        utmApplied,
        animating,
        shopDomain,
        isLoading,
        error,
        isPixelEnabled,
        isWebhookEnabled,
        billingPlan,
        connectedChannels,
        canNext,
        goTo,
        simulateConnect,
        handleConnectShopify,
        setShopifyConnected,
        setConnectingShopify,
        setGoogleConnected,
        setMetaConnected,
        setConnectingGoogle,
        setConnectingMeta,
        setUtmApplied,
        setShopDomain,
        setStep,
        setBillingPlan,
    };
}
