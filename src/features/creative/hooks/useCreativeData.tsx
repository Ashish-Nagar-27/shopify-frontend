import { creativesApi } from "../api";
import { useDateStore } from "@/store/useDateStore";
import { useQuery } from "@tanstack/react-query";




import type { FacebookCreativeInsightsResponse } from "../types/creative";

export function useFacebookCreativeData() {
  const { creativeDates } = useDateStore();
  const [startDate, endDate] = creativeDates;

  return useQuery<FacebookCreativeInsightsResponse>({
    queryKey: ["facebookCreativeData", { startDate, endDate }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startdate", startDate);
      if (endDate) queryParams.append("enddate", endDate);

      return await creativesApi.getCreative(queryParams);
    },
    enabled: Boolean(startDate && endDate),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}