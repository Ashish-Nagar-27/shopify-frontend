import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { handleRefreshToken } from "./refresh-token";

export const api = axios.create({
    baseURL: env.API_BASE_URL,
    // timeout: 15000,
    headers: { 
        "Content-Type": "application/json",
    },
});

import { useAuthStore } from "@/store/useAuthStore";

// Request interceptor to add token if available
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = useAuthStore.getState();
        const tokens = state.tokens;
        const user = state.user;

        const isAuthRoute = config.url?.includes('login') || config.url?.includes('register') || config.url?.includes('signup');

        if (config.url?.includes('/api/billing')) {
            config.headers['ngrok-skip-browser-warning'] = 'true';
        }

        if (!isAuthRoute) {

            if (tokens?.access && !config?.url?.includes("/refresh")) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
                config.headers.workspaceid = user?.id;
            }

            if (user?.adminid) {
                config.headers["admin-id"] = user.adminid;
            }
            
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response ? error.response.status : null;
        // Handle common errors
        if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/refresh')) {

            originalRequest._retry = true;

            try {
                const newAccessToken = await handleRefreshToken();
                
                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
