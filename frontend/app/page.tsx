'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { QuizListSection } from '@/components/sections/QuizListSection';
import { LoggedInWelcomeSection } from '@/components/sections/LoggedInWelcomeSection';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { Spinner } from '@/components/ui/Spinner';

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [hasQuizzes, setHasQuizzes] = useState<boolean | null>(null);

  const handleQuizCountChange = (count: number) => {
    setHasQuizzes(count > 0);
  };

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

  // Visa quiz-lista för inloggade användare
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {hasQuizzes === false && <LoggedInWelcomeSection />}
      <section id="alla-quiz" className="scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] bg-clip-text text-transparent">
            Alla quiz
          </h2>
          <p className="text-gray-500 mt-2">Spela dina egna och andra användares quiz</p>
        </div>
        <QuizListSection onQuizCountChange={handleQuizCountChange} />
      </section>
    </div>
  );
}
