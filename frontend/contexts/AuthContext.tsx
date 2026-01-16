'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizDataSource } from '@/lib/data';
import type { AuthResponseDto, LoginDto, RegisterDto, UpdateProfileDto } from '@/types';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginDto) => {
    const response = await quizDataSource.login(data);
    localStorage.setItem('authToken', response.token);
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (data: RegisterDto) => {
    const response = await quizDataSource.register(data);
    localStorage.setItem('authToken', response.token);
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const response = await quizDataSource.updateProfile(data);
    localStorage.setItem('authToken', response.token);
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
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
