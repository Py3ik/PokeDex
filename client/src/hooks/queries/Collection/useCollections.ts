import { api } from "@/api";
import { collectionKeys } from "@/constants/queries";
import type { PaginatedCollectionsResponse } from "@/types/collection";
import { useQuery } from "@tanstack/react-query";

export const useCollections = () => {
  return useQuery({
    queryKey: collectionKeys.list(),
    queryFn: async () => {
      const response =
        await api.get<PaginatedCollectionsResponse>("collections");
      return response.data;
    },
    select: (res) => res.data,
    staleTime: 2 * 60 * 1000,
  });
};
