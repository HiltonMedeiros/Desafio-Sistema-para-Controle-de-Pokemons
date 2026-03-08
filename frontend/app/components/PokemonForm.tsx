'use client';
import { useState, useEffect } from 'react';
import { CreatePokemonDto, Pokemon } from '../services/pokemon';
import { Save, X, Info, Zap } from "lucide-react";

interface Props {
  initialData?: Pokemon;
  onSubmit: (data: CreatePokemonDto) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const TYPES = ["Normal", "Fogo", "Água", "Elétrico", "Planta", "Gelo", "Lutador", "Veneno", "Terra", "Voador", "Psíquico", "Inseto", "Pedra", "Fantasma", "Dragão", "Sombrio", "Aço", "Fada"];

export default function PokemonForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [formData, setFormData] = useState<CreatePokemonDto>({
    name: '',
    type: '',
    level: 1,
    hp: 1,
    pokedexNumber: 1,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        level: initialData.level,
        hp: initialData.hp,
        pokedexNumber: initialData.pokedexNumber,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.name && formData.type && formData.pokedexNumber > 0;

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            {initialData ? 'Editar Registro' : 'Novo Espécime'}
          </h2>
          <p className="text-slate-500 text-xs mt-1">Preencha os dados técnicos do Pokémon</p>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome do Pokémon */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            Nome do Pokémon
          </label>
          <input
            required
            placeholder="Ex: Charizard"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tipo com Select Estilizado */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo Principal</label>
            <select
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="" disabled className="bg-slate-900">Selecione</option>
              {TYPES.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
              ))}
            </select>
          </div>

          {/* Nº Pokedex */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nº Pokedex</label>
            <input
              type="number"
              required
              min={1}
              placeholder="001"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              value={formData.pokedexNumber}
              onChange={(e) => setFormData({...formData, pokedexNumber: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Nível */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nível de Poder</label>
            <input
              type="number"
              required
              min={1}
              max={100}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: Number(e.target.value)})}
            />
          </div>

          {/* HP */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pontos de Vida (HP)</label>
            <input
              type="number"
              required
              min={1}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-all"
              value={formData.hp}
              onChange={(e) => setFormData({...formData, hp: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex gap-3 items-start">
          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Certifique-se de que os dados técnicos coincidem com os registros oficiais da Pokédex para evitar erros de sincronização.
          </p>
        </div>

        {/* Ações do Formulário */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading || !isValid}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? 'Salvando...' : 'Confirmar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}