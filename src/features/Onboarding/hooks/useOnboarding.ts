import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { onboardingApi } from "../api/onboardingApi";
import { integrationApi } from "@/features/integration/api/integrationApi";
import type { UseOnboardingReturn, OnboardingStatusResponse } from "../types/onboarding.types";

const STEP_ROUTES: Record<string, string> = {
    welcome: "/onboarding/welcome",
    shopify: "/onboarding/shopify",
    billing: "/onboarding/billing",
    storefront_tracking: "/onboarding/enable-tracking",
    ad_channels: "/onboarding/ad-channels",
    utm_params: "/onboarding/utm-params",
    dashboard_ready: "/onboarding/complete"
};

const STEP_ORDER = [
    "welcome",
    "shopify",
    "billing",
    "storefront_tracking",
    "ad_channels",
    "utm_params",
    "dashboard_ready",
    "dashboard"
];

export function useOnboarding(): UseOnboardingReturn {
    const navigate = useNavigate();
    const location = useLocation();

    // Compute step from current URL pathname so Back button works properly
    const currentStepIndex = STEP_ORDER.findIndex(key => location.pathname.includes(STEP_ROUTES[key]));
    const step = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

    const {
        data: status = null,
        isLoading: isLoadingStatus,
        refetch: fetchStatus
    } = useQuery({
        queryKey: ['onboardingStatus'],
        queryFn: onboardingApi.getStatus,
        staleTime: 1000 * 60, // 1 minute stale time
    });

    const { data: embedStatus } = useQuery({
        queryKey: ["embedStatus"],
        queryFn: integrationApi.getEmbedStatus,
    });

    const [animating, setAnimating] = useState(false);
    const [shopDomain, setShopDomain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [billingPlan, setBillingPlan] = useState<string | null>(null);
    const [utmApplied, setUtmApplied] = useState<Record<string, boolean>>({
        google: false,
        meta: false,
    });
    
    // Legacy simulated states
    const [connectingGoogle, setConnectingGoogle] = useState(false);
    const [connectingMeta, setConnectingMeta] = useState(false);

    useEffect(() => {
        if (status) {
            const targetRoute = STEP_ROUTES[status.current_step];
            if (status.current_step === "dashboard") {
                navigate("/");
            } else if (targetRoute && !window.location.pathname.includes(targetRoute)) {
                const backendStepIndex = STEP_ORDER.indexOf(status.current_step);
                const currentPathStepIndex = STEP_ORDER.findIndex(key => window.location.pathname.includes(STEP_ROUTES[key]));
                
                // Only redirect if backend is ahead of frontend, or if frontend is on an unknown path
                if (backendStepIndex >= currentPathStepIndex || currentPathStepIndex === -1) {
                    navigate(targetRoute, { replace: true });
                }
            }

            // Sync UTM completed states from backend
            if (status.steps?.utm_params) {
                setUtmApplied(prev => ({
                    ...prev,
                    google: prev.google || !!status.steps.utm_params?.google_utm_done,
                    meta: prev.meta || !!status.steps.utm_params?.facebook_utm_done,
                }));
            }
        }
    }, [status, navigate]);

    const [isAutoVerifying, setIsAutoVerifying] = useState(false);

    useEffect(() => {
        if (
            status?.current_step === "storefront_tracking" &&
            embedStatus?.active &&
            status?.steps?.storefront_tracking?.status !== "completed" &&
            !isAutoVerifying
        ) {
            setIsAutoVerifying(true);
            onboardingApi.enableTracking().then(async () => {
                await fetchStatus();
            }).catch(err => {
                console.error("Failed to automatically complete storefront_tracking step:", err);
            }).finally(() => {
                setIsAutoVerifying(false);
            });
        }
    }, [status, embedStatus, fetchStatus, isAutoVerifying]);

    const connectedChannels: string[] = [];
    if (status?.steps.ad_channels?.google_connected) connectedChannels.push("google");
    if (status?.steps.ad_channels?.meta_connected) connectedChannels.push("meta");

    const canNext = () => {
        if (step === 1) return true;
        if (step === 2) return status?.steps.shopify?.status === "completed";
        if (step === 3) return status?.steps.billing?.status === "completed" || billingPlan !== null; 
        if (step === 4) return status?.steps.storefront_tracking?.status === "completed" || !!embedStatus?.active;
        if (step === 5) return connectedChannels.length > 0;
        if (step === 6) return connectedChannels.some((c) => utmApplied[c]);
        return true;
    };

    const simulateConnect = (
        setter: (v: boolean) => void,
        loadingSetter: (v: boolean) => void
    ) => {
        loadingSetter(true);
        setTimeout(async () => {
            loadingSetter(false);
            setter(true);
            await fetchStatus(); // Refresh status after simulated connect
        }, 1600);
    };

    async function handleConnectShopify() {
        let shop = shopDomain.trim();
        if (!shop.trim() && !status?.steps.shopify?.shop_domain) {
            console.log('domain ',status?.steps.shopify?.shop_domain)
            setError("Please enter your Shopify store domain");
            return;
        }
        if (!shopDomain.trim() && status?.steps.shopify?.shop_domain) {
            shop = status?.steps.shopify?.shop_domain
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await onboardingApi.connectShopify(shop, "onboarding");
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

    const transitionWithAnimation = async (action: () => Promise<void>) => {
        if (animating) return;
        setAnimating(true);
        try {
            await action();
            await fetchStatus();
        } catch (err) {
            console.error("Action failed", err);
        } finally {
            setTimeout(() => setAnimating(false), 260);
        }
    };

    async function handleFinishWelcome() {
        await transitionWithAnimation(() => onboardingApi.finishWelcome());
    }

    // async function handleEnableTracking() {
    //     setIsLoading(true);
    //     setError(null);
          
    //     const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID; 
    //     const EMBED_HANDLE = import.meta.env.VITE_SHOPIFY_EMBED_HANDLE;
    //     const shopDomainVal = status?.steps?.shopify?.shop_domain 
    //     const shopHandle = shopDomainVal ? shopDomainVal.replace(/\.myshopify\.com$/, "") : undefined;

    //     if(!shopDomainVal){
    //         alert("Please connect your Shopify store first.");
    //         return;
    //     }
    //       console.log('shopDomainVal ', shopDomainVal)
    //       console.log('embed ', EMBED_HANDLE)
    //     try {
    //         // const url = `https://admin.shopify.com/store/${shopHandle}/themes/current/editor?context=apps&appEmbed=${encodeURIComponent(
    //         //     `${CLIENT_ID}%2F${EMBED_HANDLE}`
    //         // )}`;
    //               const url = `https://admin.shopify.com/store/${shopHandle}/themes/current/editor?context=apps&appEmbed=${encodeURIComponent(
    //         `${CLIENT_ID}/${EMBED_HANDLE}`
    //     )}`;

    //         console.log(url);
    //         window.open(url, "_blank");
    //     } catch (err) {
    //         console.error("Failed to open theme editor:", err);
    //         setError("Failed to open theme editor. Please try again.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    async function handleEnableTracking() {
    setIsLoading(true);
    setError(null);

    const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
    const EMBED_HANDLE = import.meta.env.VITE_SHOPIFY_EMBED_HANDLE;
    const shopDomainVal = status?.steps?.shopify?.shop_domain;
    const shopHandle = shopDomainVal ? shopDomainVal.replace(/\.myshopify\.com$/, "") : undefined;

    if (!shopDomainVal) {
        alert("Please connect your Shopify store first.");
        setIsLoading(false);
        return;
    }

    try {
        const url = `https://admin.shopify.com/store/${shopHandle}/themes/current/editor?context=apps&appEmbed=${encodeURIComponent(
            `${CLIENT_ID}/${EMBED_HANDLE}`
        )}`;

        console.log(url);
        // window.location.href = url
        window.open(url, "_blank")
    } catch (err) {
        console.error("Failed to open theme editor:", err);
        setError("Failed to open theme editor. Please try again.");
    } finally {
        setIsLoading(false);
    }
}

    async function handleExtensionVerified() {
        setIsLoading(true);
        setError(null);
        try {
            await onboardingApi.enableTracking();
            await fetchStatus();
        } catch (err) {
            console.error("Failed to verify extension status in backend:", err);
            setError("Failed to verify extension status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
   

async function handleFinishUtms() {
        await transitionWithAnimation(() => onboardingApi.finishUtms());
    }

    async function handleComplete() {
        await transitionWithAnimation(() => onboardingApi.complete())
        .then(() => {
            navigate("/reporting");
        })
        .catch((err) =>{ console.log('err ', err)})
    }

    async function handleFinishSingleUtm(channel: string) {
        try {
            const platform = channel === "meta" ? "facebook" : channel;
            await onboardingApi.finishSingleUtm(platform as "facebook" | "google");
            setUtmApplied(prev => ({ ...prev, [channel]: true }));
            fetchStatus(); // Refetch to keep state perfectly in sync
        } catch (error) {
            console.error(`Failed to finish ${channel} utm`, error);
            throw error;
        }
    }

    async function handleNext() {
        const nextRoute = STEP_ROUTES[STEP_ORDER[step]];
        if (step === 1) {
            if (status?.steps?.welcome?.status === "completed") {
                if (nextRoute) navigate(nextRoute);
            } else {
                await handleFinishWelcome();
                if (nextRoute) navigate(nextRoute);
            }
        } else if (step === 6) {
            if (status?.steps?.utm_params?.status === "completed") {
                if (nextRoute) navigate(nextRoute);
            } else {
                await handleFinishUtms();
                if (nextRoute) navigate(nextRoute);
            }
        } else {
            // For other steps, just manually navigate to the next step if they click continue
            if (nextRoute) navigate(nextRoute);
        }
    }

    const handlePrev = () => {
        if (animating) return;
        const prevRoute = STEP_ROUTES[STEP_ORDER[step - 2]];
        if (prevRoute) {
            navigate(prevRoute);
        }
    };

    return {
        status,
        isLoadingStatus,
        step,
        animating,
        shopDomain,
        setShopDomain,
        isLoading,
        error,
        billingPlan,
        setBillingPlan,
        utmApplied,
        setUtmApplied,
        connectedChannels,
        connectingGoogle,
        setConnectingGoogle,
        connectingMeta,
        setConnectingMeta,
        canNext,
        simulateConnect,
        handleConnectShopify,
        handleFinishWelcome,
        handleEnableTracking,
        handleExtensionVerified,
        handleFinishUtms,
        handleComplete,
        handleNext,
        handlePrev,
        handleFinishSingleUtm
    };
}
