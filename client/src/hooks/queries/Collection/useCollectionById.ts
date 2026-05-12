import { api } from "@/api";
import { collectionKeys } from "@/constants/queries";
import type { Collection } from "@/types/collection";
import { useQuery } from "@tanstack/react-query";

export const useCollectionById = (id: string) => {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Collection>(`collections/${id}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};
