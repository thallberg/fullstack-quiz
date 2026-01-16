'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { quizDataSource } from '@/lib/data';
import { QuizListSection } from '@/components/sections/QuizListSection';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { CreateQuizGuideSection } from '@/components/sections/CreateQuizGuideSection';
import type { QuizResponseDto } from '@/types';

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await quizDataSource.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      // Om användaren inte är inloggad och får 401, det är okej
      if (err instanceof Error && err.message.includes('401')) {
        setQuizzes([]);
      } else {
        setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Laddar...</p>
        </div>
      </div>
    );
  }

  // Visa välkomstsektion om användaren inte är inloggad
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WelcomeSection />
      </div>
    );
  }

  // Om inloggad men inga quiz finns, visa guide för att skapa quiz
  if (quizzes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <CreateQuizGuideSection />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Alla Quiz
        </h1>
        <p className="text-lg text-purple-700 font-medium">Utforska och spela quiz skapade av användare</p>
      </div>
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <QuizListSection />
      )}
    </div>
  );
}
