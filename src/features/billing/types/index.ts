export interface Plan {
    id: string;
    displayName: string;
    price: string;
    trialDays: number;
    sortOrder: number;
    features: string[]; // Mocking this config for UI
}

export interface Subscription {
    id: string;
    shopId: string;
    planId: string;
    status: "ACTIVE" | "FROZEN" | "CANCELLED" | "DECLINED" | "PENDING";
    trialStartDate?: string;
    trialEndDate?: string;
    plan?: Plan;
}
