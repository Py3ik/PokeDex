import { api } from "@/api";
import { collectionKeys } from "@/constants/queries";
import type { PaginatedCollectionsResponse } from "@/types/collection";
import { useQuery } from "@tanstack/react-query";

export const useCollections = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: collectionKeys.list({ limit, offset }),
    queryFn: async () => {
      const response = await api.get<PaginatedCollectionsResponse>(
        `collections?limit=${limit}&offset=${offset}`,
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};
