export interface PokemonSummary {
  id: number;
  name: string;
  weight: number;
  image: string | null;
  types: string[];
}

export interface PaginatedPokemonResponse {
  data: PokemonSummary[];
  total: number;
  limit: number;
  offset: number;
}
