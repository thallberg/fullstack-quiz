'use client';

import { useAuth } from '@/contexts/AuthContext';
import { QuizListSection } from '@/components/sections/QuizListSection';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { CreateQuizGuideSection } from '@/components/sections/CreateQuizGuideSection';
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue via-purple to-pink bg-clip-text text-transparent mb-2">
          Alla Quiz
        </h1>
        <p className="text-lg text-purple-text font-medium">Utforska och spela quiz skapade av användare</p>
      </div>
      <QuizListSection />
    </div>
  );
}
