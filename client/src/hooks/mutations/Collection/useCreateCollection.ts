import { api } from "@/api";
import { collectionKeys } from "@/constants/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("collections/", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      return data;
    },
    onError: (error: any) => {
      console.error("Failed to create recipient:", error);
    },
  });
};
