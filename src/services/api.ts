import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

export const api = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

import { useAuthStore } from "@/store/useAuthStore";

// Request interceptor to add token if available
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = useAuthStore.getState();
        const tokens = state.tokens;
        const user = state.user;

        const isAuthRoute = config.url?.includes('login') || config.url?.includes('register') || config.url?.includes('signup');

        if (!isAuthRoute) {
            if (tokens?.access) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
                config.headers.workspaceid = `854e249d718e42cba341aa0559931c12`;
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
    (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Optional: Dispatch logout action or redirect
            // console.warn("Unauthorized access - redirecting to login");
        }
        return Promise.reject(error);
    }
);
