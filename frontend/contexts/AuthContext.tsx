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
    // Check if user is logged in by calling a protected endpoint
    // Cookie will be sent automatically
    const checkAuth = async () => {
      try {
        // Try to get user info from a protected endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api'}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.userId || data.id,
            username: data.username,
            email: data.email,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginDto) => {
    const response = await quizDataSource.login(data);
    // Token is now in HttpOnly cookie, not in response
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    setUser(user);
  };

  const register = async (data: RegisterDto) => {
    const response = await quizDataSource.register(data);
    // Token is now in HttpOnly cookie, not in response
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    setUser(user);
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const response = await quizDataSource.updateProfile(data);
    // Token is now in HttpOnly cookie, not in response
    const user = {
      id: response.userId,
      username: response.username,
      email: response.email,
    };
    setUser(user);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookie
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Ignore errors, still clear local state
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
