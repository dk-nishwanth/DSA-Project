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
    // Special case for Nishwanth user as student
    if (credentials.email === 'Nishwanth' && credentials.password === 'Nishwanth') {
      const nishwanthUser = {
        id: 'student-nishwanth',
        name: 'Nishwanth',
        email: 'Nishwanth',
        role: 'student'
      };
      
      const response = {
        user: nishwanthUser,
        token: 'nishwanth-mock-token'
      };
      
      this.setToken(response.token);
      this.setUser(response.user);
      return response;
    }
    
    // Special case for admin users
    if (credentials.email === 'admin' && credentials.password === 'admin' ||
        credentials.email === 'NishwanthAdmin' && credentials.password === 'Nishwanth') {
      const adminUser = {
        id: 'admin-1',
        name: credentials.email === 'Nishwanth' ? 'Nishwanth' : 'Administrator',
        email: credentials.email,
        role: 'admin'
      };
      
      const response = {
        user: adminUser,
        token: 'admin-mock-token'
      };
      
      this.setToken(response.token);
      this.setUser(response.user);
      return response;
    }
    
    // Regular login flow
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      this.setToken(response.token);
      this.setUser(response.user);
      return response;
    } catch (error) {
      // For demo purposes, create a mock user if API call fails
      console.log('Using mock login due to API error');
      const mockUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'student'
      };
      
      const mockResponse = {
        user: mockUser,
        token: 'mock-token-' + Date.now()
      };
      
      this.setToken(mockResponse.token);
      this.setUser(mockResponse.user);
      return mockResponse;
    }
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