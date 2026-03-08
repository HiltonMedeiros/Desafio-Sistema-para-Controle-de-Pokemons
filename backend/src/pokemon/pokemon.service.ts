import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async create(createPokemonDto: CreatePokemonDto) {
    return this.prisma.pokemon.create({
      data: createPokemonDto,
    });
  }

  async findAll() {
    return this.prisma.pokemon.findMany();
  }

  async findOne(id: number) {
    return this.prisma.pokemon.findUnique({
      where: { id },
    });
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return this.prisma.pokemon.update({
      where: { id },
      data: updatePokemonDto,
    });
  }

  async remove(id: number) {
    return this.prisma.pokemon.delete({
      where: { id },
    });
  }
}