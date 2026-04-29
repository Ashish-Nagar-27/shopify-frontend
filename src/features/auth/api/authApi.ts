import { api } from "@/services/api";
import type { LoginCredentials, RegisterCredentials, LoginResponse } from "../types";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/login", credentials);
        return response.data;
    },
    register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>("/auth/create", credentials);
        return response.data;
    },
    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>("/auth/forgetpassword", { username: email });
        return response.data;
    },
    resetPassword: async (data: { refreshtoken: string; newpassword: string }): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>("/auth/resetpassword", data);
        return response.data;
    },
};
