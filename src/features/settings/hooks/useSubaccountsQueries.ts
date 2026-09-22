import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "../api/queryKeys";
import * as subaccountsApi from "../api/subaccountsApi";
import type {
  InviteMemberPayload,
  UpdateMemberPayload,
} from "../types/settings.types";

export function useTeamMembersQuery() {
  return useQuery({
    queryKey: settingsKeys.teamMembers(),
    queryFn: subaccountsApi.fetchTeamMembers,
  });
}

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteMemberPayload) => subaccountsApi.inviteMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMemberPayload) => subaccountsApi.updateMember(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() }),
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => subaccountsApi.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.teamMembers() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}
