import React from "react";

import { PricingPage } from "@/features/billing/pages/PricingPage";

interface BillingStepProps {
    billingPlan: string | null;
    setBillingPlan: React.Dispatch<React.SetStateAction<string | null>>;
}

export function BillingStep({ billingPlan, setBillingPlan }: BillingStepProps) {


 return  <PricingPage embedded onPlanActive={setBillingPlan} />

}


