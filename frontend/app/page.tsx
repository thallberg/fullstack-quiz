'use client';

import { useAuth } from '@/contexts/AuthContext';
import { QuizListSection } from '@/components/sections/QuizListSection';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { LoggedInWelcomeSection } from '@/components/sections/LoggedInWelcomeSection';
import { Spinner } from '@/components/ui/Spinner';

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" className="border-blue" />
          <p className="text-gray-500 text-lg">Laddar...</p>
        </div>
      </div>
    );
  }

  // Visa välkomstsektion om användaren inte är inloggad
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WelcomeSection />
      </div>
    );
  }

  // Visa välkomstsektion för inloggade användare
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <LoggedInWelcomeSection />
    </div>
  );
}
