import { api } from "@/services/api";
import type { FacebookCreativeInsightsResponse } from "../types/creative";

export const creativesApi = {
    getCreative: async (
        queryParams: URLSearchParams | Record<string, string> | any
    ): Promise<FacebookCreativeInsightsResponse> => {
        const queryStr =
            queryParams instanceof URLSearchParams
                ? queryParams.toString()
                : new URLSearchParams(queryParams).toString();
        const response = await api.get<FacebookCreativeInsightsResponse>(
            `/creative/creativeinsights/facebook?${queryStr}`
        );
        return response.data;
    },
};

export * from "./queryKeys";
