import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  PokeApiDetail,
  PokeApiListResponse,
  PaginatedPokemonResponse,
  PokemonSummary,
} from './pokemon.types';

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getAllPokemon(
    limit = 20,
    offset = 0,
  ): Promise<PaginatedPokemonResponse> {
    const apiUrl = this.config.get<string>('POKEAPI_URL');

    const response = await this.httpService.axiosRef.get<PokeApiListResponse>(
      `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`,
    );

    const { count, results } = response.data;

    const data: PokemonSummary[] = await Promise.all(
      results.map(async (item) => {
        const detail = await this.httpService.axiosRef.get<PokeApiDetail>(
          item.url,
        );
        const pokemonDetail = detail.data;
        return {
          id: pokemonDetail.id,
          name: pokemonDetail.name,
          weight: pokemonDetail.weight,
          image: pokemonDetail.sprites.front_default,
          types: pokemonDetail.types.map((t) => t.type.name),
        };
      }),
    );

    return { data, total: count, limit, offset };
  }

  async searchPokemon(name: string): Promise<PaginatedPokemonResponse> {
    const apiUrl = this.config.get<string>('POKEAPI_URL');

    const detail = await this.httpService.axiosRef.get<PokeApiDetail>(
      `${apiUrl}/pokemon/${name}`,
    );
    const pokemonDetail = detail.data;

    const pokemon: PokemonSummary = {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      weight: pokemonDetail.weight,
      image: pokemonDetail.sprites.front_default,
      types: pokemonDetail.types.map((t) => t.type.name),
    };

    return { data: [pokemon], total: 1, limit: 1, offset: 0 };
  }
}
