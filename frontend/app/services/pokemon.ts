import api from './api'; // Reutiliza a instância configurada

export interface Pokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  hp: number;
  pokedexNumber: number;
  ownerId: number;
}

export type CreatePokemonDto = Omit<Pokemon, 'id' | 'ownerId'>;
export type UpdatePokemonDto = Partial<CreatePokemonDto>;

export const pokemonService = {
  async getAll(): Promise<Pokemon[]> {
    const response = await api.get<Pokemon[]>('/pokemon');
    return response.data;
  },

  async getOne(id: number): Promise<Pokemon> {
    const response = await api.get<Pokemon>(`/pokemon/${id}`);
    return response.data;
  },

  async create(data: CreatePokemonDto) {
    const response = await api.post('/pokemon', data);
    return response.data;
  },

  async update(id: number, data: UpdatePokemonDto) {
    const response = await api.patch(`/pokemon/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    return api.delete(`/pokemon/${id}`);
  },
};