import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizDataSource } from '../lib/data';
import { API_BASE_URL } from '../lib/config';
import type { LoginDto, RegisterDto, UpdateProfileDto } from '../types';

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
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.userId ?? data.id,
            username: data.username,
            email: data.email,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginDto) => {
    const response = await quizDataSource.login(data);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const register = async (data: RegisterDto) => {
    const response = await quizDataSource.register(data);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const response = await quizDataSource.updateProfile(data);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
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
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
