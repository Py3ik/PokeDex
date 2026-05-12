import { pokemonListKeys } from "@/constants/queries";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedPokemonResponse } from "@/types/pokemon";

export const useSearchPokemon = (search: string) => {
  return useQuery({
    queryKey: pokemonListKeys.list({ search }),
    queryFn: async () => {
      const res = await api.get<PaginatedPokemonResponse>(
        `pokemon?search=${encodeURIComponent(search)}`,
      );
      return res.data;
    },
    enabled: search.length > 0,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
};
