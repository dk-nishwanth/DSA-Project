import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Subscription } from '@/types/subscription';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  subscription: Subscription | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
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
          
          // Simple token validation - check if it exists and is not expired
          try {
            const tokenData = JSON.parse(atob(storedToken.split('.')[1] || '{}'));
            const isTokenValid = tokenData.exp ? tokenData.exp * 1000 > Date.now() : true;
            
            if (isTokenValid) {
              console.log('Loading stored user:', userData.email);
              setUser(userData);
            } else {
              console.log('Token expired, clearing storage');
              localStorage.removeItem('dsa_user');
              localStorage.removeItem('dsa_token');
            }
          } catch (tokenError) {
            // If token parsing fails, assume it's valid (for mock tokens)
            console.log('Loading stored user (token parsing failed, assuming valid):', userData.email);
            setUser(userData);
          }
        } else {
          console.log('No stored user or token found');
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('dsa_user');
        localStorage.removeItem('dsa_token');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadStoredUser, 100);
    return () => clearTimeout(timer);
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
        role: (response.user.role as 'user' | 'admin') || 'user',
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
      
      // Store user and token in localStorage for persistence
      localStorage.setItem('dsa_user', JSON.stringify(fullUser));
      if (response.token) {
        localStorage.setItem('dsa_token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password });
      
      // Convert the response to match our User type
      const fullUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: (response.user.role as 'user' | 'admin') || 'user',
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
      
      // Store user and token in localStorage for persistence
      localStorage.setItem('dsa_user', JSON.stringify(fullUser));
      if (response.token) {
        localStorage.setItem('dsa_token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear stored data
    localStorage.removeItem('dsa_user');
    localStorage.removeItem('dsa_token');
    localStorage.removeItem('dsa-learning-progress');
    authService.logout();
  };

  const updateSubscription = (subscription: Subscription) => {
    // SUBSCRIPTION FEATURES DISABLED - Function preserved for future use
    // if (user) {
    //   const updatedUser = { ...user, subscription };
    //   setUser(updatedUser);
    //   // Update localStorage
    //   localStorage.setItem('dsa_user', JSON.stringify(updatedUser));
    // }
  };

  const checkFeatureAccess = (feature: string): boolean => {
    // SUBSCRIPTION FEATURES DISABLED - All features are now free and accessible
    return true; // All users have access to all features
  };

  // SUBSCRIPTION FEATURES DISABLED - All users are treated as premium
  const isPremium = true; // All users have premium access

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
