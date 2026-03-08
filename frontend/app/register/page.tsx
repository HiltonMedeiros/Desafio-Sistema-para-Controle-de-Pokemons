'use client';
import { useState } from 'react';
import { authService } from '../services/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ email, password });
      alert('Treinador cadastrado com sucesso!');
      router.push('/'); // Redireciona para o login
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao cadastrar treinador.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Novo Treinador</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <input 
          type="email" 
          placeholder="E-mail" 
          className="w-full p-2 mb-4 border rounded text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="w-full p-2 mb-4 border rounded text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Confirmar Senha" 
          className="w-full p-2 mb-6 border rounded text-gray-800"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Criar Conta'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta? <Link href="/" className="text-red-500 hover:underline">Faça login</Link>
        </p>
      </form>
    </div>
  );
}