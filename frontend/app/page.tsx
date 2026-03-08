'use client';
import { useState } from 'react';
import { authService } from './services/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      await authService.login({ email, password });
      router.push('/dashboard'); 
    } catch (error: any) {
      console.error('Erro no login:', error);
      const message = error?.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Pokédex Admin</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <input 
          type="email" 
          placeholder="E-mail" 
          className="w-full p-2 mb-4 border rounded text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="w-full p-2 mb-6 border rounded text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
        Não é um treinador? <Link href="/register" className="text-red-500 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}