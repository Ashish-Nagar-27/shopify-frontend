export interface Profile {
    fullName?: string;
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    phone_number?: string;
    company?: string | null;
    companyName?: string;
    company_name?: string;
    timezone?: string;
    currency?: string;
    role?: string;
    workspaceName?: string;
    [key: string]: any;
}

export interface UpdateProfilePayload {
    email: string;
    name?: string;
    fullName?: string;
    phone?: string | null;
    company?: string | null;
    companyName?: string | null;
    timezone?: string;
    currency?: string;
    [key: string]: any;
}

export interface ProfileFormState {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    timezone: string;
    currency: string;
}