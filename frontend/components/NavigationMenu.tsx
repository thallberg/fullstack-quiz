'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFriendshipNotifications } from '@/hooks/useFriendshipNotifications';
import { Button } from './ui/Button';

export function NavigationMenu() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { hasPendingInvites } = useFriendshipNotifications();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue via-purple to-pink shadow-lg border-b border-blue-dark/40 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-white hover:text-yellow-200 transition-colors drop-shadow-md">
                Quiz App 🎯
              </Link>
              {/* Desktop Navigation Links */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-8">
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
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info - Always visible */}
              {isAuthenticated ? (
                <>
                  <span className="text-sm sm:text-base text-white font-medium">
                    Hej, <span className="font-bold text-white">{user?.username}</span>
                  </span>
                  <Link 
                    href="/profile" 
                    className={`hidden md:block relative text-white hover:text-yellow-200 transition-colors duration-200 font-medium px-2 py-1 ${
                      pathname === '/profile' ? 'text-yellow-200' : ''
                    }`}
                  >
                    Min Profil
                    {hasPendingInvites && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red text-white rounded-full text-xs font-bold animate-pulse">
                        !
                      </span>
                    )}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 transition-all duration-300 ${
                        pathname === '/profile' ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                      }`}
                    />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block">
                    <Button variant="outline" size="sm" className="bg-white/20 border-white text-white hover:bg-white/30">
                      Logga in
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden md:block">
                    <Button variant="secondary" size="sm" className="bg-yellow hover:bg-yellow-dark text-purple-text font-bold">
                      Registrera
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white hover:text-yellow-200 transition-colors p-2 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-x-0 top-16 bg-gradient-to-r from-blue via-purple to-pink shadow-xl border-b border-blue-dark/40 z-40 md:hidden"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <div className="flex flex-col h-full w-full">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <div className="flex flex-col flex-1 overflow-y-auto pt-4">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className={`px-6 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors border-b border-white/10 ${
                      pathname === '/' ? 'bg-white/20 text-yellow-200' : ''
                    }`}
                  >
                    Alla Quiz
                  </Link>
                  <Link
                    href="/create"
                    onClick={closeMobileMenu}
                    className={`px-6 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors border-b border-white/10 ${
                      pathname === '/create' ? 'bg-white/20 text-yellow-200' : ''
                    }`}
                  >
                    Skapa Quiz
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`relative px-6 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors border-b border-white/10 ${
                      pathname === '/profile' ? 'bg-white/20 text-yellow-200' : ''
                    }`}
                  >
                    Min Profil
                    {hasPendingInvites && (
                      <span className="absolute top-3 right-6 flex items-center justify-center w-5 h-5 bg-red text-white rounded-full text-xs font-bold animate-pulse">
                        !
                      </span>
                    )}
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col flex-1 justify-center items-center space-y-4 px-6">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full bg-white/20 border-white text-white hover:bg-white/30 text-lg py-3">
                    Logga in
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="w-full"
                >
                  <Button variant="secondary" size="lg" className="w-full bg-yellow hover:bg-yellow-dark text-purple-text font-bold text-lg py-3">
                    Registrera
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
