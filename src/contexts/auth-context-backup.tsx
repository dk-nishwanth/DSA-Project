import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { User, Subscription } from '@/types/subscription';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  subscription: Subscription | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (subscription: Subscription) => void;
  checkFeatureAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('dsa_user');
        const storedToken = localStorage.getItem('dsa_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          // Validate token expiry if needed
          const tokenData = JSON.parse(atob(storedToken.split('.')[1] || '{}'));
          const isTokenValid = tokenData.exp ? tokenData.exp * 1000 > Date.now() : true;
          
          if (isTokenValid) {
            setUser(userData);
          } else {
            // Token expired, clear storage
            localStorage.removeItem('dsa_user');
            localStorage.removeItem('dsa_token');
          }
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('dsa_user');
        localStorage.removeItem('dsa_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      // Convert the response to match our User type
      const fullUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'system',
          language: 'javascript',
          difficulty: 'beginner',
          notifications: { email: true, push: false, reminders: true }
        },
        subscription: {
          id: 'default',
          userId: response.user.id,
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          trialUsed: false
        },
        progress: {
          topicsCompleted: [],
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, name);
      setUser(response.user);
      
      // Store user and token in localStorage for persistence
      localStorage.setItem('dsa_user', JSON.stringify(response.user));
      if (response.token) {
        localStorage.setItem('dsa_token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
          difficulty: 'beginner',
          notifications: { email: true, push: false, reminders: true }
        },
        subscription: {
          id: 'default',
          userId: response.user.id,
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          trialUsed: false
        },
        progress: {
          topicsCompleted: [],
          challengesSolved: [],
          totalTimeSpent: 0,
          currentStreak: 0,
          longestStreak: 0,
          skillLevel: {
            arrays: 0, strings: 0, linkedLists: 0, trees: 0, graphs: 0,
            sorting: 0, searching: 0, dynamicProgramming: 0, overall: 0
          },
          achievements: []
        }
      };
      setUser(fullUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateSubscription = (subscription: Subscription) => {
    if (user) {
      setUser({ ...user, subscription });
    }
  };

  const checkFeatureAccess = (feature: string): boolean => {
    if (!user) return false;
    
    const subscription = user.subscription;
    
    // Check if subscription has expired
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const endDate = new Date(subscription.endDate);
      
      if (now > endDate) {
        // Subscription has expired, treat as free user
        switch (feature) {
          case 'unlimited_topics':
          case 'advanced_visualizations':
          case 'practice_problems':
          case 'progress_tracking':
          case 'mock_interviews':
            return false;
          default:
            return true;
        }
      }
    }
    
    if (!subscription || subscription.status !== 'active') {
      // Free tier limitations
      switch (feature) {
        case 'unlimited_topics':
        case 'advanced_visualizations':
        case 'practice_problems':
        case 'progress_tracking':
        case 'mock_interviews':
          return false;
        default:
          return true;
      }
    }
    
    return true; // Premium users have access to all features
  };

  // Check if user has premium access (including expiry check)
  const isPremium = (() => {
    if (!user?.subscription || user.subscription.plan !== 'premium' || user.subscription.status !== 'active') {
      return false;
    }
    
    // Check if subscription has expired
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    return now <= endDate;
  })();

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isPremium,
    subscription: user?.subscription || null,
    login,
    register,
    logout,
    updateSubscription,
    checkFeatureAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}