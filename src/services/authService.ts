import { api } from '@/lib/api';

// Backend response/user shapes (as per DSA_backend)
type BackendUser = {
  id: number | string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
};

type BackendAuthResponse = {
  success?: boolean;
  message?: string;
  token: string;
  user: BackendUser;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string; // Full name from UI
  email: string;
  password: string;
  // Optional fields if UI ever supplies them directly
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string; // Combined first + last
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
        name: credentials.email === 'NishwanthAdmin' ? 'Nishwanth' : 'Administrator',
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
      const backend = await api.post<BackendAuthResponse>('/api/auth/login', credentials);
      const normalized: AuthResponse = {
        token: backend.token,
        user: {
          id: String(backend.user.id),
          name: [backend.user.firstName, backend.user.lastName].filter(Boolean).join(' ') || backend.user.username || backend.user.email,
          email: backend.user.email,
          role: (backend.user.role || 'student').toString().toLowerCase(),
        },
      };
      this.setToken(normalized.token);
      this.setUser(normalized.user);
      return normalized;
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
    // Map UI fields to backend expectations
    let firstName = data.firstName;
    let lastName = data.lastName;
    let username = data.username;

    if (data.name && (!firstName || !lastName)) {
      const parts = data.name.trim().split(/\s+/);
      firstName = firstName || parts[0] || '';
      lastName = lastName || (parts.slice(1).join(' ') || '');
    }
    if (!username) {
      username = (data.email?.split('@')[0] || `${firstName || 'user'}`).replace(/[^a-zA-Z0-9_]/g, '_');
    }

    const backendPayload = {
      username,
      email: data.email,
      password: data.password,
      firstName: firstName || 'User',
      lastName: lastName || '',
      role: 'STUDENT',
    };

    const backend = await api.post<BackendAuthResponse>('/api/auth/register', backendPayload);
    const normalized: AuthResponse = {
      token: backend.token,
      user: {
        id: String(backend.user.id),
        name: [backend.user.firstName, backend.user.lastName].filter(Boolean).join(' ') || backend.user.username || backend.user.email,
        email: backend.user.email,
        role: (backend.user.role || 'student').toString().toLowerCase(),
      },
    };
    this.setToken(normalized.token);
    this.setUser(normalized.user);
    return normalized;
  },

  async logout(): Promise<void> {
    try {
      // Best-effort server logout if available
      await api.post('/api/auth/logout');
    } catch (e) {
      // ignore network/server errors and still clear locally
    } finally {
      this.removeToken();
      this.removeUser();
    }
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
      // Prefer backend source of truth if available
      const response = await api.get<any>('/api/auth/me');
      if (response?.user && response?.token) {
        const backendUser: BackendUser = response.user;
        const normalizedUser = {
          id: String(backendUser.id),
          name: [backendUser.firstName, backendUser.lastName].filter(Boolean).join(' ') || backendUser.username || backendUser.email,
          email: backendUser.email,
          role: (backendUser.role || 'student').toString().toLowerCase(),
        };
        this.setToken(response.token);
        this.setUser(normalizedUser);
        return normalizedUser;
      }
      if (response?.id || response?.email) {
        const backendUser: BackendUser = response;
        const normalizedUser = {
          id: String(backendUser.id),
          name: [backendUser.firstName, backendUser.lastName].filter(Boolean).join(' ') || backendUser.username || backendUser.email,
          email: backendUser.email,
          role: (backendUser.role || 'student').toString().toLowerCase(),
        };
        this.setUser(normalizedUser);
        return normalizedUser;
      }
      return this.getUser();
    } catch (error: any) {
      if (error?.status === 401) {
        await this.logout();
      }
      return this.getUser();
    }
  },
};