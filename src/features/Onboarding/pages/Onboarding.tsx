import { useRef } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useOnboarding } from "../hooks/useOnboarding";
import { WelcomeStep } from "../components/WelcomeStep";
import { ShopifyStep } from "../components/ShopifyStep";
import { AdChannelsStep } from "../components/AdChannelsStep";
import { UtmParamsStep } from "../components/UtmParamsStep";
import { CompleteStep } from "../components/CompleteStep";
import { BillingStep } from "../components/BillingStep";

const STEPS = [
    { id: 1, label: "Welcome" },
    { id: 2, label: "Shopify" },
    { id: 3, label: "Billing" },
    { id: 4, label: "Ad Channels" },
    { id: 5, label: "UTM Params" },
    { id: 6, label: "Complete" },
];

const CheckIcon = () => <Check size={18} />;

export function OnboardingPage() {
    const onboarding = useOnboarding();
    const { step, animating, canNext, goTo } = onboarding;
    const contentRef = useRef<HTMLDivElement>(null);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <WelcomeStep />;
            case 2:
                return (
                    <ShopifyStep
                        shopifyConnected={onboarding.shopifyConnected}
                        isLoading={onboarding.isLoading}
                        shopDomain={onboarding.shopDomain}
                        setShopDomain={onboarding.setShopDomain}
                        error={onboarding.error}
                        handleConnectShopify={onboarding.handleConnectShopify}
                    />
                );
            case 3:
                return (
                    <BillingStep
                        billingPlan={onboarding.billingPlan}
                        setBillingPlan={onboarding.setBillingPlan}
                    />
                );
            case 4:
                return (
                    <AdChannelsStep
                        googleConnected={onboarding.googleConnected}
                        metaConnected={onboarding.metaConnected}
                        connectingGoogle={onboarding.connectingGoogle}
                        connectingMeta={onboarding.connectingMeta}
                        simulateConnect={onboarding.simulateConnect}
                        setGoogleConnected={onboarding.setGoogleConnected}
                        setConnectingGoogle={onboarding.setConnectingGoogle}
                        setMetaConnected={onboarding.setMetaConnected}
                        setConnectingMeta={onboarding.setConnectingMeta}
                    />
                );
            case 5:
                return (
                    <UtmParamsStep
                        connectedChannels={onboarding.connectedChannels}
                        utmApplied={onboarding.utmApplied}
                        setUtmApplied={onboarding.setUtmApplied}
                    />
                );
            case 6:
                return <CompleteStep />;
            default:
                return null;
        }
    };

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
                {renderStep()}
            </Card>

            {/* Navigation */}
            {step < 6 && (
                <footer className="w-full max-w-[620px] flex justify-between items-center mt-6">
                    {step > 1 ? (
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-6 font-medium transition-colors border-[1.5px]"
                            onClick={() => goTo("prev")}
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
                        onClick={() => goTo("next")}
                    >
                        {step === 5 ? "Finish Setup" : "Continue"} →
                    </Button>
                </footer>
            )}
        </div>
    );
}