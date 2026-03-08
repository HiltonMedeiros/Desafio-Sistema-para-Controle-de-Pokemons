export class CreatePokemonDto {
  name: string;          // Ex: Pikachu [cite: 14]
  type: string;          // Ex: Elétrico [cite: 15]
  level: number;         // Valor numérico [cite: 16]
  hp: number;            // Pontos de vida [cite: 17]
  pokedexNumber: number; // ID oficial [cite: 19]
  ownerId: number;       // Relacionamento com o treinador [cite: 24]
}
