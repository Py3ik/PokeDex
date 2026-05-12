import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { Collection } from "@/types/collection";
import { collectionKeys } from "@/constants/queries";
import { useToast } from "@/context/useToast";
import axios from "axios";

export const useImportCollection = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (payload: { name: string; pokemonIds: number[] }) =>
      api
        .post<Collection>("collections/import", payload)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to import collection";
      showToast(message, "error");
    },
  });
};
