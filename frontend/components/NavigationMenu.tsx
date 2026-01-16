'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';

export function NavigationMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

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
                <Link 
                  href="/" 
                  className={`relative text-white hover:text-yellow-200 transition-colors duration-200 font-medium px-2 py-1 ${
                    pathname === '/' ? 'text-yellow-200' : ''
                  }`}
                >
                  Alla Quiz
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 transition-all duration-300 ${
                      pathname === '/' ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}
                  />
                </Link>
                <Link 
                  href="/create" 
                  className={`relative text-white hover:text-yellow-200 transition-colors duration-200 font-medium px-2 py-1 ${
                    pathname === '/create' ? 'text-yellow-200' : ''
                  }`}
                >
                  Skapa Quiz
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 transition-all duration-300 ${
                      pathname === '/create' ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}
                  />
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
                <Link 
                  href="/profile" 
                  className={`relative text-white hover:text-yellow-200 transition-colors duration-200 font-medium px-2 py-1 ${
                    pathname === '/profile' ? 'text-yellow-200' : ''
                  }`}
                >
                  Min Profil
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 transition-all duration-300 ${
                      pathname === '/profile' ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}
                  />
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
