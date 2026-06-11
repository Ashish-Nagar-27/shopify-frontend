import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/features/billing/api/billingApi";
import { useAuthStore } from "@/store/useAuthStore";
import { PricingPage } from "@/features/billing/pages/PricingPage";

interface BillingStepProps {
    billingPlan: string | null;
    setBillingPlan: React.Dispatch<React.SetStateAction<string | null>>;
    isCompleted?: boolean;
}

export function BillingStep({ billingPlan, setBillingPlan, isCompleted }: BillingStepProps) {
    const [searchParams] = useSearchParams();
    const isActivated = searchParams.get("activated") === "true";
    const { user } = useAuthStore();

    const shouldShowSuccess = isCompleted || isActivated;

    const { data: statusData, isLoading } = useQuery({
        queryKey: ["billing-status", user?.id],
        queryFn: () => billingApi.getStatus(user!.id!),
        enabled: !!user?.id && shouldShowSuccess,
    });

    useEffect(() => {
        if (statusData?.subscription?.plan?.id) {
            setBillingPlan(statusData.subscription.plan.id);
        }
    }, [statusData, setBillingPlan]);

    if (shouldShowSuccess) {
        if (isLoading) {
            return (
                <div className="w-full flex justify-center py-20">
                    <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            );
        }

        const planName = statusData?.subscription?.plan?.name || "Unknown";

        return (
            <div className="w-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6 border-4 border-green-50 dark:border-green-900/20">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h2 className="text-3xl font-extrabold text-foreground mb-4">Payment Successful!</h2>
                
                <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-sm mb-6">
                    <p className="text-muted-foreground mb-4">
                        Your subscription has been successfully activated.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-2 border border-border/50">
                        <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Plan</span>
                        <span className="text-2xl font-bold text-foreground capitalize">{planName}</span>
                    </div>
                </div>
                
                <p className="text-muted-foreground text-sm">
                    You can now proceed to the next step.
                </p>
            </div>
        );
    }

    return <PricingPage embedded onPlanActive={setBillingPlan} />;
}

