'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';

export function NavigationMenu() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg border-b-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-white hover:text-yellow-200 transition-colors drop-shadow-md">
              Quiz App 🎯
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/">
                  <Button variant="link" size="sm">
                    Alla Quiz
                  </Button>
                </Link>
                <Link href="/create">
                  <Button variant="link" size="sm">
                    Skapa Quiz
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-base text-white font-medium">
                  Hej, <span className="font-bold text-white">{user?.username}</span>
                </span>
                <Link href="/profile">
                  <Button variant="link" size="sm">
                    Min Profil
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white text-white hover:bg-white/30">
                    Logga in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    Registrera
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
