import { api } from "./api";

export const integrationApi = {
    // ==================================
    // shopify integrations apis
    // ==================================
 connectShopify: async (shop: string, source?:string): Promise<{ url: string }> => {
        if(!source) source = 'integration'
        const response = await api.post<{ url: string }>("/api/shopify/connect", { shop,source });
        // const response = await api.post<{ url: string }>("/shopifyintegration", { shop });
        return response.data;
    },

    // ==================================
    // meta ads integrations apis
    // ==================================

    connectMetaAdsAccounts: async (payload: { accessToken: string, expireon: string | null, accountinfo: { id: string, name: string }[] }) => {
        const response = await api.post("/setting/integrations/facebook/clientcredentials", payload);
        return response;
    },


    // ==================================
    // Google ads integrations apis
    // ==================================
    connectGoogleAdsAccounts: async (customerIdParam: string, refreshToken: string | null) => {
        const queryStr = `customerId=${encodeURIComponent(customerIdParam)}&refresh_token=${encodeURIComponent(refreshToken || "")}&systemid=null`;
        const response = await api.post(`/setting/integrations/google/clientaccount?${queryStr}`);
        return response;
    },
}