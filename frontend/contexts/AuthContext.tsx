'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import type { AuthResponseDto, LoginDto, RegisterDto, UpdateProfileDto } from '@/types';

interface AuthContextType {
  user: AuthResponseDto | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginDto) => {
    const response = await apiClient.login(data);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setUser(response);
  };

  const register = async (data: RegisterDto) => {
    const response = await apiClient.register(data);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setUser(response);
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const response = await apiClient.updateProfile(data);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    setUser(response);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
