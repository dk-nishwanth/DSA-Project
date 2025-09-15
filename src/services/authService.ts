import { api } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

const TOKEN_KEY = 'dsa_auth_token';
const USER_KEY = 'dsa_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  },

  async logout(): Promise<void> {
    this.removeToken();
    this.removeUser();
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): any | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async getCurrentUser(): Promise<any> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }
      // You can implement a call to get current user from the backend if needed
      // const response = await api.get<any>('/api/auth/me');
      // return response;
      return this.getUser();
    } catch (error) {
      this.logout();
      return null;
    }
  },
};