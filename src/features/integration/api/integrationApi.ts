import { api } from "@/services/api";

export type EmbedStatusResponse = {
    active: boolean;
    isThemePixelactive?: boolean;
};

export const integrationApi = {
    connectShopify: async (shop: string): Promise<{ url: string }> => {
        const response = await api.post<{ url: string }>("/shopify/connect", { shop });
        return response.data;
    },
    togglePixel: async (enabled: boolean): Promise<void> => {
        const response = await api.post<void>("/shopify/pixel/toggle", { enabled });
        return response.data;
    },
    toggleWebhook: async (enabled: boolean): Promise<void> => {
        const response = await api.post<void>("/shopify/webhook/toggle", { enabled });
        return response.data;
    },
    getEmbedStatus: async (): Promise<EmbedStatusResponse> => {
        const response = await api.get<EmbedStatusResponse>("/shopify/embed-status");
        return response.data;
    }
};
