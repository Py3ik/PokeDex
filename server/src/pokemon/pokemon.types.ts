export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokeApiDetail {
  id: number;
  name: string;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
}

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
