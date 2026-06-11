import { useRef } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useOnboarding } from "../hooks/useOnboarding";
import { WelcomeStep } from "../components/WelcomeStep";
import { ShopifyStep } from "../components/ShopifyStep";
import { AdChannelsStep } from "../components/AdChannelsStep";
import { UtmParamsStep } from "../components/UtmParamsStep";
import { CompleteStep } from "../components/CompleteStep";
import { BillingStep } from "../components/BillingStep";
import { EnableTracking } from "../components/EnableTracking";
import type { UseOnboardingReturn } from "../types/onboarding.types";

const STEPS = [
    { id: 1, label: "Welcome" },
    { id: 2, label: "Shopify" },
    { id: 3, label: "Billing" },
    { id: 4, label: "Enable Tracking" },
    { id: 5, label: "Ad Channels" },
    { id: 6, label: "UTM Params" },
    { id: 7, label: "Complete" },
];

const CheckIcon = () => <Check size={18} />;

export function OnboardingPage() {
    const onboarding = useOnboarding();
    const { step, animating, canNext, handleNext, handlePrev, isLoadingStatus } = onboarding;
    const contentRef = useRef<HTMLDivElement>(null);

    if (isLoadingStatus) {
        return (
            <div className="min-h-svh bg-background flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-background flex flex-col items-center px-4 pb-12 font-sans text-foreground">
            {/* Header */}
            <header className="w-full max-w-[720px] flex justify-between items-center pt-7">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                    <span className="font-mono font-bold text-lg tracking-tight text-foreground">
                        trackocity
                    </span>
                </div>
                <span className="text-[13px] text-muted-foreground font-mono">
                    Step {Math.min(step, 6)} of 6
                </span>
            </header>

            {/* Stepper */}
            <nav className="flex items-center justify-center mt-9 mb-8 w-full max-w-[620px]">
                {STEPS.map((s, i) => {
                    const done = step > s.id;
                    const active = step === s.id;
                    return (
                        <div
                            key={s.id}
                            className="flex items-center flex-shrink-0"
                        >
                            <div
                                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-250 flex-shrink-0 ${
                                    done
                                        ? "bg-primary/70 text-primary-foreground border-primary/70"
                                        : active
                                          ? "bg-primary text-primary-foreground border-primary animate-pulse"
                                          : "bg-secondary text-muted-foreground border-border"
                                }`}
                            >
                                {done ? <CheckIcon /> : s.id}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-12 h-0.5 mx-1.5 rounded-sm transition-colors duration-250 ${
                                        done ? "bg-primary/70" : "bg-border"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Content Card */}
            <Card
                ref={contentRef}
                className={`w-full ${step === 3 ? "max-w-6xl px-4 py-8" : "max-w-[620px] px-10 py-11"} rounded-2xl min-h-[340px] flex flex-col shadow-sm ${
                    !animating ? "animate-in fade-in slide-in-from-bottom-3 duration-400" : ""
                }`}
                key={step}
            >
                <Outlet context={onboarding} />
            </Card>

            {/* Navigation */}
            {step < 7 && (
                <footer className="w-full max-w-[620px] flex justify-between items-center mt-6">
                    {step > 1 ? (
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-6 font-medium transition-colors border-[1.5px]"
                            onClick={handlePrev}
                        >
                            ← Back
                        </Button>
                    ) : (
                        <div />
                    )}
                    <Button
                        size="lg"
                        className={`px-8 font-bold transition-opacity tracking-tight ${
                            canNext() ? "hover:opacity-90" : "opacity-35"
                        }`}
                        disabled={!canNext()}
                        onClick={handleNext}
                    >
                        {step === 6 ? "Finish Setup" : "Continue"} →
                    </Button>
                </footer>
            )}
        </div>
    );
}

// --- Route Wrappers ---

export function WelcomeRoute() {
    return <WelcomeStep />;
}

export function ShopifyRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();

    return (
        <ShopifyStep
            shopifyConnected={onboarding.status?.steps?.shopify?.status === "completed"}
            isLoading={onboarding.isLoading}
            shopDomain={onboarding.shopDomain}
            setShopDomain={onboarding.setShopDomain}
            error={onboarding.error}
            handleConnectShopify={onboarding.handleConnectShopify}
        />
    );
}

export function BillingRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();
    const isCompleted = onboarding.status?.steps?.billing?.status === "completed";
    return (
        <BillingStep
            billingPlan={onboarding.billingPlan}
            setBillingPlan={onboarding.setBillingPlan}
            isCompleted={isCompleted}
        />
    );
}

export function EnableExtensionRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();
    return (
        <EnableTracking
            isThemeExtensionEnabled={onboarding.status?.steps?.storefront_tracking?.status === "completed"}
            isLoading={onboarding.isLoading}
            error={onboarding.error}
            onEnableTracking={onboarding.handleEnableTracking}
            onExtensionVerified={onboarding.handleExtensionVerified}
            onNext={onboarding.handleNext}
        />
    );
}

export function AdChannelsRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();
    return (
        <AdChannelsStep
            googleConnected={onboarding.status?.steps?.ad_channels?.google_connected ?? false}
            metaConnected={onboarding.status?.steps?.ad_channels?.meta_connected ?? false}
            connectingGoogle={onboarding.connectingGoogle}
            connectingMeta={onboarding.connectingMeta}
            simulateConnect={onboarding.simulateConnect}
            setGoogleConnected={onboarding.setConnectingGoogle} // legacy mock bindings
            setConnectingGoogle={onboarding.setConnectingGoogle}
            setMetaConnected={onboarding.setConnectingMeta} // legacy mock bindings
            setConnectingMeta={onboarding.setConnectingMeta}
        />
    );
}

export function UtmParamsRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();
    return (
        <UtmParamsStep
            connectedChannels={onboarding.connectedChannels}
            utmApplied={onboarding.utmApplied}
            setUtmApplied={onboarding.setUtmApplied}
            handleFinishSingleUtm={onboarding.handleFinishSingleUtm}
        />
    );
}

export function CompleteRoute() {
    const onboarding = useOutletContext<UseOnboardingReturn>();
    // CompleteRoute doesn't use standard footer but has its own button
    return <CompleteStep handleComplete={onboarding.handleComplete} />;
}