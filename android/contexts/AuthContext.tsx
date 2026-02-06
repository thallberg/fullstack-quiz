import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizDataSource } from '../lib/data';
import { apiClient, setAuthToken, clearAuthToken } from '../lib/api';
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
        const data = await apiClient.getProfile();
        if (data) {
          setUser({
            id: data.userId,
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
    const token = (response as { token?: string }).token;
    if (token) setAuthToken(token);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const register = async (data: RegisterDto) => {
    const response = await quizDataSource.register(data);
    const token = (response as { token?: string }).token;
    if (token) setAuthToken(token);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const response = await quizDataSource.updateProfile(data);
    const token = (response as { token?: string }).token;
    if (token) setAuthToken(token);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
    });
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // ignore
    }
    clearAuthToken();
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
