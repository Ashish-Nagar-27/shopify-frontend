import { api } from "@/services/api";
import type { LoginCredentials, RegisterCredentials, LoginResponse } from "../types";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/login", credentials);
        return response.data;
    },
    register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/register", credentials);
        return response.data;
    },
};
