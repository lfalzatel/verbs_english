'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  level: number;
  experience: number;
  role: 'player' | 'admin';
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
  createdAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, email?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Actualizar último login
          const updatedUser = {
            ...parsedUser,
            lastLoginAt: new Date().toISOString()
          };
          setUser(updatedUser);
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (name: string, email?: string) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email?.trim() || undefined,
        level: 1,
        experience: 0,
        role: 'player',
        preferences: {
          theme: 'light',
          language: 'es',
          soundEnabled: true,
          notificationsEnabled: true
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('authUser', JSON.stringify(newUser));
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
      lastLoginAt: new Date().toISOString()
    };

    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      },
      lastLoginAt: new Date().toISOString()
    };

    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}