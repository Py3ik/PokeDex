import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getAll(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search?: string,
  ) {
    if (search?.trim()) {
      return this.pokemonService.searchPokemon(search.trim().toLowerCase());
    }
    return this.pokemonService.getAllPokemon(
      Number(limit) || 20,
      Number(offset) || 0,
    );
  }
}
