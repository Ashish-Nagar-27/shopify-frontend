import { api } from "@/services/api";
import type {
  InviteMemberPayload,
  TeamMember,
  TeamMembersResponse,
  UpdateMemberPayload,
} from "../types/settings.types";

// ---------- Team members / sub-accounts ----------

export async function fetchTeamMembers(): Promise<TeamMembersResponse> {
  const { data } = await api.get<TeamMembersResponse>("/setting/team/members");
  return data;
}

export async function inviteMember(payload: InviteMemberPayload): Promise<TeamMember> {
  const { data } = await api.post<TeamMember>("/setting/team/invite", payload);
  return data;
}

export async function updateMember(payload: UpdateMemberPayload): Promise<TeamMember> {
  const { data } = await api.patch<TeamMember>(`/setting/edit/team/members/${payload.id}`, payload);
  return data;
}

export async function removeMember(id: TeamMember["id"]): Promise<void> {
  return await api.delete(`/setting/team/members/${id}`);
}
