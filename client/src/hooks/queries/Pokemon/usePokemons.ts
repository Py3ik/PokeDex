import { pokemonListKeys } from "@/constants/queries";
import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginatedPokemonResponse } from "@/types/pokemon";

export const usePokemons = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: pokemonListKeys.list({ limit }),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await api.get<PaginatedPokemonResponse>(
        `pokemon?limit=${limit}&offset=${pageParam}`,
      );
      return res.data;
    },
    getNextPageParam: (lastPage: PaginatedPokemonResponse) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
};
