import { api } from "@/services/api";
import type { Profile, UpdateProfilePayload } from "../types";

/**
 * Fetches the user profile from GET /auth/getprofile
 */
export async function fetchProfile(): Promise<Profile> {
  const { data } = await api.get("/auth/getprofile");
  const raw = data?.data || data?.user || data || {};
  return {
    ...raw,
    fullName: raw?.name || raw?.fullName || raw?.full_name || "",
    name: raw?.name || raw?.fullName || raw?.full_name || "",
    email: raw?.email || "",
    phone: raw?.phone || raw?.phone_number || "",
    company: raw?.company ?? raw?.companyName ?? raw?.company_name ?? null,
    companyName: raw?.company ?? raw?.companyName ?? raw?.company_name ?? "",
    timezone: raw?.timezone || "",
    currency: raw?.currency || "",
    role: raw?.role || "",
    workspaceName: raw?.workspaceName || raw?.workspace_name || "",
  };
}

/**
 * Updates the user profile via PUT /auth/updateprofile
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<any> {
  const body = {
    email: payload.email,
    phone: payload.phone ?? null,
    name: payload.name || payload.fullName,
    company: payload.company !== undefined ? payload.company : (payload.companyName || null),
    timezone: payload.timezone,
    currency: payload.currency,
  };
  const { data } = await api.put("/auth/updateprofile", body);
  return data;
}
