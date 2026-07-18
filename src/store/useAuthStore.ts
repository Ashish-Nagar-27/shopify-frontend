import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/features/auth/api/authApi";
import type { User, LoginCredentials, RegisterCredentials, AuthTokens } from "@/features/auth/types";

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<any>;
    logout: () => void;
    setTokens: (tokens: AuthTokens) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const data = await authApi.login(credentials);
                    set({
                        user: {
                            id: data.user_id,
                            adminid: data.adminid,
                            is_admin: data.is_admin,
                            isleadgen: data.isleadgen,
                            onboarding_status: data.onboarding_status,
                        },
                        tokens: data.tokens,
                        isAuthenticated: true,
                        isLoading: false,
                    });
          
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (credentials) => {
                set({ isLoading: true });
                try {
                    const data = await authApi.register(credentials);
                    set({ isLoading: false });
                    return data;
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, tokens: null, isAuthenticated: false });
            },

            setTokens: (tokens) => {
                set({ tokens });
            },
        }),
        {
            name: "shopify_client_auth",
            // Omitting isLoading from persistence prevents the app 
            // from being permanently stuck in a loading state if refreshed
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
