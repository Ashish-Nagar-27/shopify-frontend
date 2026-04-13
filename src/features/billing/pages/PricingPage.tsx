import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { billingApi } from "../api/billingApi";
import { PricingCard } from "../components/PricingCard";
import type { Plan } from "../types";
import { useAuthStore } from "@/store/useAuthStore";

// Note: Typically you would fetch features from the backend or hardcode them if static
// For the UI rendering, we'll map common plans as described by the backend rules
const ENHANCED_PLANS: Record<string, string[]> = {
    "starter": ["50K views", "UTM track", "Basic attr"],
    "growth": ["200K views", "UTM track", "Basic attr", "Custom dash"],
    "pro": ["500K views", "UTM track", "Full attr", "Custom dash", "Priority"],
    "enterprise": ["2M views", "Full attr", "Custom dash", "Dedic. support"],
};

export function PricingPage() {
    const { user, logout } = useAuthStore();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const { data: plansData, isLoading: isLoadingPlans } = useQuery({
        queryKey: ["billing-plans"],
        queryFn: billingApi.getPlans,
    });

    const { data: statusData } = useQuery({
        queryKey: ["billing-status", user?.shopId],
        queryFn: () => billingApi.getStatus(user!.shopId!),
        enabled: !!user?.shopId,
    });

    const subscribeMutation = useMutation({
        mutationFn: ({ planId }: { planId: string }) =>
            billingApi.subscribe(planId),
        onSuccess: (data) => {
            if (data.confirmationUrl) {
                window.location.href = data.confirmationUrl;
            }
        },
    });

    const handleSelectPlan = async (plan: Plan) => {
        setSelectedPlanId(plan.id);

        try {
            await subscribeMutation.mutateAsync({
                planId: plan.id,

            });
        } catch (error) {
            console.error("Subscription failed", error);
            alert("Failed to initiate subscription");
        } finally {
            setSelectedPlanId(null);
        }
    };

    const activePlanId = statusData?.subscription?.planId;

    return (
        <div className="min-h-svh bg-background flex flex-col">
            <main className="mx-auto max-w-7xl px-6 py-12 flex-1 w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Scale your analytics with simple, transparent pricing.
                        Cancel or upgrade anytime directly from your Shopify admin.
                    </p>
                </div>

                {isLoadingPlans ? (
                    <div className="flex justify-center py-20">
                        <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                ) : (
                    <div className="grid gap-8 max-w-fit mx-auto sm:grid-cols-2 lg:grid-cols-4 items-center">
                        {plansData?.plans?.map((plan) => {
                            // Injecting UI specific mock array into the plan object for display
                            const displayPlan = {
                                ...plan,
                                features: ENHANCED_PLANS[plan.id.toLowerCase()] || ["Standard Features", "Email Support"],
                            };

                            return (
                                <PricingCard
                                    key={plan.id}
                                    plan={displayPlan}
                                    isCurrentPlan={activePlanId === plan.id}
                                    isPopular={plan.displayName.toLowerCase().includes("growth")}
                                    isLoading={subscribeMutation.isPending && selectedPlanId === plan.id}
                                    onSelect={handleSelectPlan}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
