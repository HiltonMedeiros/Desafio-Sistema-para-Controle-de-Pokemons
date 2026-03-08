'use client';
import { useEffect, useState } from 'react';
import { pokemonService, Pokemon, CreatePokemonDto } from '../services/pokemon';
import { authService } from '../services/auth';
import { useRouter } from 'next/navigation';
import PokemonForm from '../components/PokemonForm';

export default function Dashboard() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/');
      return;
    }
    loadPokemons();
  }, [router]);

  const loadPokemons = async () => {
    try {
      const data = await pokemonService.getAll();
      setPokemons(data);
    } catch (error) {
      console.error("Erro ao carregar Pokémons", error);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPokemon(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CreatePokemonDto) => {
    setLoading(true);
    try {
      if (selectedPokemon) {
        await pokemonService.update(selectedPokemon.id, formData);
      } else {
        await pokemonService.create(formData);
      }
      await loadPokemons();
      setIsModalOpen(false);
    } catch {
      alert("Erro ao salvar Pokémon. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este Pokémon?")) {
      try {
        await pokemonService.delete(id);
        loadPokemons();
      } catch {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Minha Pokédex</h1>
          <div className="flex gap-4">
            <button 
              onClick={handleOpenCreate}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              + Novo Pokémon
            </button>
            <button onClick={() => { authService.logout(); router.push('/'); }} className="text-gray-500 hover:text-red-600">Sair</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pokemons.map(pokemon => (
            <div key={pokemon.id} className="bg-white p-6 rounded-lg shadow-md relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => handleOpenEdit(pokemon)} className="text-blue-500 text-sm">Editar</button>
                <button onClick={() => handleDelete(pokemon.id)} className="text-red-500 text-sm">Excluir</button>
              </div>
              <span className="text-xs font-mono text-gray-400">#{pokemon.pokedexNumber}</span>
              <h2 className="text-xl font-bold text-gray-800">{pokemon.name}</h2>
              <p className="text-sm text-blue-600 font-semibold">{pokemon.type}</p>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Nível: {pokemon.level}</span>
                <span>HP: {pokemon.hp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
              <PokemonForm 
                key={selectedPokemon?.id ?? 'new'}
                initialData={selectedPokemon}
                onSubmit={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}