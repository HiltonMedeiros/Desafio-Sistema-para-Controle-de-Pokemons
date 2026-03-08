import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  hp: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokedexNumber: number;
}
