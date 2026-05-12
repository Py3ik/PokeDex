import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: String, default: '20' })
  @ApiQuery({ name: 'offset', required: false, type: String, default: '0' })
  @ApiQuery({ name: 'search', required: false, type: String })
  getAll(
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
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
