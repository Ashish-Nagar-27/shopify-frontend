import { useAuthStore } from "@/store/useAuthStore";
import { api } from "./api";

let authRefreshPromise: Promise<string> | null = null;

export const handleRefreshToken = async (): Promise<string> => {
    // Return existing promise if a refresh is already in progress
    if (authRefreshPromise) {
        return authRefreshPromise;
    }

    const refreshTokenTask = async () => {
        try {
            const state = useAuthStore.getState();
            const refreshToken = state.tokens?.refresh;
            const workSpaceId = state.user?.id;

            if (!refreshToken || !workSpaceId) {
                state.logout();
                window.location.href = "/login";
                throw new Error("No refresh token or workspace id");
            }

        const response = await  api.post(`/refresh`, {}, {
        headers: {
          workspaceId: workSpaceId,
          Authorization: `Bearer ${refreshToken}`,
        },
      });
    

            const newAccessToken = response.data?.tokens?.access || response.data?.access_token;
            
            if (newAccessToken) {
                const newRefreshToken = response.data?.tokens?.refresh || response.data?.refresh_token || refreshToken;
                
                state.setTokens({
                    access: newAccessToken,
                    refresh: newRefreshToken,
                });
                
                return newAccessToken;
            } else {
                throw new Error("Refresh token response missing access token");
            }
        } catch (error) {
            useAuthStore.getState().logout();
            window.location.href = "/login";
            throw error;
        } finally {
            authRefreshPromise = null;
        }
    };

    authRefreshPromise = refreshTokenTask();
    return authRefreshPromise;
};