'use client';
import { useEffect, useState, useMemo } from 'react';
import { pokemonService, Pokemon, CreatePokemonDto } from '../services/pokemon';
import { authService } from '../services/auth';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, LogOut, Search, ArrowUpDown, Edit2, Trash2, Github, Linkedin } from "lucide-react";
import PokemonForm from '../components/PokemonForm';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Estados para a Modal de Confirmação de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<number | null>(null);

  // Estados de Filtro e Busca
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("pokedex");

  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/');
      return;
    }
    loadPokemons();
  }, [router]);

  const loadPokemons = async () => {
    setFetching(true);
    try {
      const data = await pokemonService.getAll();
      setPokemons(data);
    } catch (error) {
      console.error("Erro ao carregar Pokémons", error);
    } finally {
      setFetching(false);
    }
  };

  const filteredPokemons = useMemo(() => {
    let result = [...pokemons];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        String(p.pokedexNumber).includes(q)
      );
    }
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "hp") result.sort((a, b) => b.hp - a.hp);
    if (sortBy === "level") result.sort((a, b) => b.level - a.level);
    if (sortBy === "pokedex") result.sort((a, b) => a.pokedexNumber - b.pokedexNumber);
    return result;
  }, [pokemons, search, sortBy]);

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
      alert("Erro ao salvar Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  // Abre a modal de confirmação
  const openDeleteConfirm = (id: number) => {
    setPokemonToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Executa a exclusão real após confirmação
  const confirmDelete = async () => {
    if (!pokemonToDelete) return;
    setLoading(true);
    try {
      await pokemonService.delete(pokemonToDelete);
      await loadPokemons();
      setIsDeleteModalOpen(false);
    } catch {
      alert("Erro ao excluir o Pokémon.");
    } finally {
      setLoading(false);
      setPokemonToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col text-slate-200">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="h-6 w-6" alt="Ball" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Minha Pokédex</h1>
                <p className="text-slate-400 text-sm">Gerenciamento administrativo de treinador</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setSelectedPokemon(undefined); setIsModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="h-5 w-5" /> Novo Pokémon
              </button>
              <button 
                onClick={() => { authService.logout(); router.push('/'); }}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Filtros */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Buscar por nome ou número..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="pokedex">Ordenar por Nº Pokedex</option>
                <option value="name">Ordenar por Nome</option>
                <option value="level">Maior Nível</option>
                <option value="hp">Maior HP</option>
              </select>
            </div>
          </section>

          {/* Grid */}
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-slate-500 animate-pulse">Sincronizando dados...</p>
            </div>
          ) : filteredPokemons.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
               <p className="text-slate-500">Nenhum Pokémon encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPokemons.map(pokemon => (
                <div key={pokemon.id} className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">
                      #{String(pokemon.pokedexNumber).padStart(3, '0')}
                    </span>
                    
                    <div className="flex gap-1 relative z-20"> 
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPokemon(pokemon); 
                          setIsModalOpen(true);
                        }} 
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirm(pokemon.id);
                        }} 
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{pokemon.name}</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                    {pokemon.type}
                  </span>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Nível</span>
                      <span className="text-white font-semibold">{pokemon.level}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">HP</span>
                      <span className="text-white font-semibold">{pokemon.hp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredPokemons.length > 0 && (
            <p className="text-center text-xs text-slate-600 mt-8">
              Exibindo {filteredPokemons.length} de {pokemons.length} Pokémon
            </p>
          )}
        </div>
      </div>

      {/* RODAPÉ DE AUTORIA */}
      {/* RODAPÉ DE AUTORIA COM REDES SOCIAIS */}
      <footer className="mt-auto py-10 border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Lado Esquerdo: Nome e Formação */}
            <div className="text-center md:text-left space-y-2">
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-semibold">Desenvolvido por</p>
              <h2 className="text-2xl font-bold text-white tracking-tight">Hilton Medeiros Amorim</h2>
              <p className="text-slate-400 text-sm italic">
                Bacharel em Ciência da Computação <br className="hidden md:block" />
                <span className="text-blue-400/80 font-medium whitespace-nowrap">UNIPÊ · Dezembro 2025</span>
              </p>
            </div>

            {/* Lado Direito: Links Sociais */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-semibold">Conecte-se</p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/HiltonMedeiros" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-300 shadow-lg group"
                >
                  <Github className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/hilton-medeiros/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-300 shadow-lg group"
                >
                  <Linkedin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Inferior */}
          <div className="text-center mt-10 pt-6 border-t border-slate-800/30">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
              © 2026 Pokédex Administrativa · Fullstack Project
            </p>
          </div>
        </div>
      </footer>

      {/* Modais */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Excluir Pokémon?"
        message="Esta ação não pode ser desfeita. O espécime será removido permanentemente da sua base de dados."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        loading={loading}
      />
    </div>
  );
}