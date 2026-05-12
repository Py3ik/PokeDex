import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PokemonDto {
  @ApiProperty({ example: 25 })
  @IsNumber()
  id!: number;

  @ApiProperty({ example: 'pikachu' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  weight!: number;

  @ApiProperty({ example: 'https://...', nullable: true })
  @IsString()
  @IsOptional()
  image!: string | null;

  @ApiProperty({ example: ['electric'] })
  @IsArray()
  @IsString({ each: true })
  types!: string[];
}

export class CreateCollectionDto {
  @ApiProperty({ example: 'My awesome team' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: [PokemonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PokemonDto)
  pokemons!: PokemonDto[];
}
