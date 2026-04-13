import { useQueryClient } from "@tanstack/react-query";

export const useGetQueryData = (queryKeyPrefix: string[]) => {
    const queryClient = useQueryClient();
    // const data = queryClient.getQueryData({ queryKey: queryKey });
    const queries = queryClient.getQueriesData({ queryKey: queryKeyPrefix });
    // returns array of [queryKey, data] tuples — grab the first match
    const data = queries?.[0]?.[1] ?? null;

    return data;
}