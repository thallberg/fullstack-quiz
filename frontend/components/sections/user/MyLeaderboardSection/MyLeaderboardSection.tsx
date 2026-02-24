'use client';

import { useEffect, useState } from 'react';
import { fetchClient } from '@/lib/fetch';
import { Spinner } from '@/components/ui/Spinner';
import { QuizLeaderboardCard } from './QuizLeaderboard';
import { LEADERBOARD_TEXT } from '@/constant/sv/Leaderboard';
import type { MyLeaderboardDto } from '@/types';

export function MyLeaderboardSection() {
  const [myLeaderboard, setMyLeaderboard] = useState<MyLeaderboardDto>({
    quizzes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setIsLoading(true);
      setError('');

      const data = await fetchClient.getMyLeaderboard();

      setMyLeaderboard({
        quizzes: data?.quizzes || [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : LEADERBOARD_TEXT.loadError
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-blue" />
        <p className="text-gray-500">
          {LEADERBOARD_TEXT.loading}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 border border-[var(--color-red)] rounded-lg">
        <p className="text-[var(--color-red)]">{error}</p>
      </div>
    );
  }

  if (myLeaderboard.quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {LEADERBOARD_TEXT.empty.title}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {LEADERBOARD_TEXT.empty.subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {myLeaderboard.quizzes.map((quiz) => (
        <QuizLeaderboardCard
          key={quiz.quizId}
          entry={quiz}
        />
      ))}
    </div>
  );
}