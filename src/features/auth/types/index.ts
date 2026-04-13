export interface User {
    id: string; // mapped from user_id
    adminid: string; // mapped from adminid
    is_admin: boolean;
    isleadgen: boolean;
    onboarding_status: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    adminid: string;
    is_admin: boolean;
    isleadgen: boolean;
    message: string;
    onboarding_status: string;
    tokens: AuthTokens;
    user_id: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    shopLinkToken?: string;
}
