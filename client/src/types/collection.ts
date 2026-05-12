import type { PokemonSummary } from "./pokemon";

export interface Collection {
  _id: string;
  name: string;
  pokemons: PokemonSummary[];
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCollectionsResponse {
  data: Collection[];
  total: number;
  limit: number;
  offset: number;
}
