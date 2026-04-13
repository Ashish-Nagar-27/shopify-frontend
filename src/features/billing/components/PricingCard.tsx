import { CheckCircle2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Plan } from "../types";

interface PricingCardProps {
    plan: Plan;
    isCurrentPlan: boolean;
    isPopular?: boolean;
    onSelect: (plan: Plan) => void;
    isLoading?: boolean;
}

export function PricingCard({
    plan,
    isCurrentPlan,
    isPopular,
    onSelect,
    isLoading,
}: PricingCardProps) {
    return (
        <Card
            className={`relative flex flex-col overflow-hidden transition-all duration-300 ${isPopular
                    ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10"
                    : "border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                } bg-card/60 backdrop-blur-xl`}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                    POPULAR ⭐
                </div>
            )}
            <CardHeader>
                <CardTitle className="text-xl text-card-foreground uppercase tracking-wider">{plan.displayName}</CardTitle>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold text-card-foreground">
                    ${plan.price}
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <CardDescription className="pt-2 text-muted-foreground">
                    {plan.trialDays > 0 ? `${plan.trialDays} days free trial` : "No trial period"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3">
                    {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-start">
                            <CheckCircle2 className="mr-3 h-5 w-5 shrink-0 text-primary" />
                            <span className="text-sm text-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => onSelect(plan)}
                    disabled={isCurrentPlan || isLoading}
                    variant={isPopular ? "default" : "outline"}
                    className="w-full"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                        </span>
                    ) : isCurrentPlan ? (
                        "Current Plan"
                    ) : (
                        "Subscribe"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
