import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do seu backend NestJS
});

// Interceptor para anexar o token JWT em todas as requisições futuras
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;