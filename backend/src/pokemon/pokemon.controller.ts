import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
@UseGuards(JwtAuthGuard) // todas as rotas exigem Token
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto, @Request() req: any) {
    // Vincula automaticamente o ID do treinador logado ao Pokémon
    return this.pokemonService.create({
      ...createPokemonDto,
      ownerId: req.user.userId,
    });
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
    @Request() req: any,
  ) {
    const pokemon = await this.pokemonService.findOne(+id);

    if (!pokemon) {
      throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
    }

    if (pokemon.ownerId !== req.user.userId) {
      throw new ForbiddenException(
        'Você só pode editar seus próprios Pokémons',
      );
    }

    return this.pokemonService.update(+id, updatePokemonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const pokemon = await this.pokemonService.findOne(+id);

    if (!pokemon) {
      throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
    }

    if (pokemon.ownerId !== req.user.userId) {
      throw new ForbiddenException(
        'Você só pode deletar seus próprios Pokémons',
      );
    }

    return this.pokemonService.remove(+id);
  }
}

