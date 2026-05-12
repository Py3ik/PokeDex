import { api } from "@/api";
import { collectionKeys } from "@/constants/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`collections/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      return data;
    },
    onError: (error: any) => {
      console.error("Failed to delete collection:", error);
    },
  });
};
