import { api } from "@/services/api";

export type EmbedStatusResponse = {
    active: boolean;
    isThemePixelactive?: boolean;
};

export const integrationApi = {
    connectShopify: async (shop: string): Promise<{ url: string }> => {
        const response = await api.post<{ url: string }>("/api/shopify/connect", { shop });
        // const response = await api.post<{ url: string }>("/shopifyintegration", { shop });
        return response.data;
    },
    togglePixel: async (enabled: boolean): Promise<void> => {
        // const response = await api.post<void>("/api/shopify/pixel/toggle", { enabled });
        const response = await api.post<void>("/api/toggle-pixel", { enabled });
        return response.data;
    },
    toggleWebhook: async (enabled: boolean): Promise<void> => {
        const response = await api.post<void>("/api/shopify/webhook/toggle", { enabled });
        return response.data;
    },
    getEmbedStatus: async (): Promise<EmbedStatusResponse> => {
        const response = await api.get<EmbedStatusResponse>("/api/embed-status");
        return response.data;
    }
};
