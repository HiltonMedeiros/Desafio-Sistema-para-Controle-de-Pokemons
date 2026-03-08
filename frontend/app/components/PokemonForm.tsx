'use client';
import { useState } from 'react';
import { CreatePokemonDto, Pokemon } from '../services/pokemon';

interface Props {
  initialData?: Pokemon;
  onSubmit: (data: CreatePokemonDto) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function PokemonForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [formData, setFormData] = useState<CreatePokemonDto>({
    name: initialData?.name ?? '',
    type: initialData?.type ?? '',
    level: initialData?.level ?? 1,
    hp: initialData?.hp ?? 1,
    pokedexNumber: initialData?.pokedexNumber ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Editar Pokémon' : 'Novo Pokémon'}
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          required
          className="w-full p-2 border rounded text-gray-800"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <input
            required
            className="w-full p-2 border rounded text-gray-800"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nº Pokedex</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded text-gray-800"
            value={formData.pokedexNumber}
            onChange={(e) => setFormData({...formData, pokedexNumber: Number(e.target.value)})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nível</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded text-gray-800"
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: Number(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">HP</label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded text-gray-800"
            value={formData.hp}
            onChange={(e) => setFormData({...formData, hp: Number(e.target.value)})}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Salvando...' : 'Salvar Pokémon'}
        </button>
      </div>
    </form>
  );
}