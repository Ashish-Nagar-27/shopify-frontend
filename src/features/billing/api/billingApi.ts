import { api } from "@/services/api";
import type { Plan, Subscription } from "../types";

export const billingApi = {
    getPlans: async (): Promise<{ plans: Plan[] }> => {
        const response = await api.get<{ plans: Plan[] }>("/api/billing/plans");
        return response.data;
    },
    subscribe: async (planId: string, source: string): Promise<{ confirmationUrl: string }> => {
        const response = await api.post<{ confirmationUrl: string }>("/api/billing/subscribe", { plan_id: planId, source });
        return response.data;
    },
    getStatus: async (shopId: string): Promise<{ subscription: Subscription | null }> => {
        // const response = await api.get<{ subscription: Subscription | null }>(`/api/billing/status?shopId=${shopId}`);
        const response = await api.get<{ subscription: Subscription | null }>(`/api/billing/status`);
        return response.data;
    },
    changePlan: async (newPlanId: string, shopId: string): Promise<{ confirmationUrl: string }> => {
        const response = await api.post<{ confirmationUrl: string }>("/api/billing/change-plan", { new_plan_id: newPlanId, shopId });
        return response.data;
    },
    cancelSubscription: async (shopId: string): Promise<{ success: boolean }> => {
        const response = await api.post<{ success: boolean }>("/api/billing/canceldd", { shopId });
        return response.data;
    }
};
