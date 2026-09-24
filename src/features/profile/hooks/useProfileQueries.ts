import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "../apis/queryKeys";
import * as profileApi from "../apis/profileApi";
import type { UpdateProfilePayload } from "../types";

/**
 * Hook to fetch profile data (GET /auth/getprofile)
 */
export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.details(),
    queryFn: profileApi.fetchProfile,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to update profile data (POST /auth/updateprofile)
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
