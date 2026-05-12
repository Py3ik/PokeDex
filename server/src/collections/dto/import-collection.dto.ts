import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportCollectionDto {
  @ApiProperty({ example: 'My awesome team' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: [25, 1, 4] })
  @IsArray()
  @IsInt({ each: true })
  pokemonIds!: number[];
}
