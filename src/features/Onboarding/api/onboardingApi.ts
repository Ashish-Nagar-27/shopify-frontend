import { integrationApi } from "@/features/integration/api/integrationApi";
import { api } from "@/services/api";
import type { OnboardingStatusResponse } from "../types/onboarding.types";

export const onboardingApi = {
    connectShopify: async (shopDomain: string) => {
        return integrationApi.connectShopify(shopDomain);
    },
    
    getStatus: async (): Promise<OnboardingStatusResponse> => {
        const response = await api.get("/auth/onboarding/status");
        return response.data;
    },

    finishWelcome: async (): Promise<void> => {
        await api.post("/auth/onboarding/finish-welcome");
    },

    enableTracking: async (): Promise<void> => {
        await integrationApi.togglePixel(true);
        try {
            await api.post("/auth/onboarding/finish-storefront-tracking");
        } catch (error) {
            console.warn("Onboarding status endpoint failed or not implemented", error);
        }
    },

    finishUtms: async (): Promise<void> => {
        await api.post("/auth/onboarding/finish-utms");
    },

    complete: async (): Promise<void> => {
        await api.post("/auth/onboarding/complete");
    },

    connectGoogleAdsAccounts: async (customerIdParam: string, refreshToken: string | null) => {
        const queryStr = `customerId=${encodeURIComponent(customerIdParam)}&refresh_token=${encodeURIComponent(refreshToken || "")}&systemid=null`;
        const response = await api.post(`/google/clientaccount?${queryStr}`);
        return response;
    },

    connectMetaAdsAccounts: async (payload: { accessToken: string, expireon: string | null, accountinfo: { id: string, name: string }[] }) => {
        const response = await api.post("/facebook/clientcredentials", payload);
        return response;
    },

    finishSingleUtm: async (platform: "facebook" | "google"): Promise<void> => {
        await api.post("/auth/onboarding/finish-single-utm", { platform });
    }
};
