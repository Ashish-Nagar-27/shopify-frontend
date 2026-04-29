import { integrationApi } from "@/features/integration/api/integrationApi";

// Currently the onboarding API proxies calls to integrationApi 
// but can be extended here for onboarding specific overrides.
export const onboardingApi = {
    connectShopify: async (shopDomain: string) => {
        return integrationApi.connectShopify(shopDomain);
    }
};
