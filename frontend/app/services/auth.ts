import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data.access_token) {
      // Salva o token para as próximas requisições
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  async register(data: RegisterData) {
    return api.post('/auth/register', data);
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};