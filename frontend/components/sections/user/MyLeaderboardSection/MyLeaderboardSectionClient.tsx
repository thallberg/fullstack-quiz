'use client';

import { useEffect, useState } from 'react';
import { fetchClient } from '@/lib/fetch';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useMedalIcon } from '@/hooks/useMedalIcon';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Collapsible } from '@/components/ui/Collapsible';
import type { MyLeaderboardDto, QuizLeaderboardEntryDto, QuizResultEntryDto } from '@/types';

export function MyLeaderboardSection() {
  const formatDate = useDateFormatter();
  const getMedalIcon = useMedalIcon();
  const [myLeaderboard, setMyLeaderboard] = useState<MyLeaderboardDto>({
    quizzes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyLeaderboard();
  }, []);

  const loadMyLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchClient.getMyLeaderboard();
      setMyLeaderboard({
        quizzes: data?.quizzes || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda min leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultEntry = (result: QuizResultEntryDto, position: number) => {
    return (
      <div
        key={result.resultId}
        className={`p-3 sm:p-4 rounded-lg border ${
          position === 1
            ? 'bg-yellow-50 border-yellow-border/50'
            : position === 2
            ? 'bg-gray-50 border-gray-border/50'
            : position === 3
            ? 'bg-orange-50 border-orange-border/50'
            : 'bg-gray-50 border-gray-border/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-700 shrink-0">
              {getMedalIcon(position)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 break-words">
                {result.percentage}%
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
            <Badge variant="success" className="bg-green text-white text-xs sm:text-sm">
              {result.score}/{result.totalQuestions}
            </Badge>
            {result.completedAt && (
              <Badge variant="info" className="hidden sm:inline-flex text-xs">
                {formatDate(result.completedAt)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQuizLeaderboard = (entry: QuizLeaderboardEntryDto) => {
    const sortedResults = [...(entry.results || [])].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

    return (
      <Collapsible
        key={entry.quizId}
        title={
          <span className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="break-words">{entry.quizTitle}</span>
            <Badge variant="info" className="text-xs shrink-0">
              {sortedResults.length} {sortedResults.length === 1 ? 'resultat' : 'resultat'}
            </Badge>
          </span>
        }
        className="border-[var(--color-purple)]/50 shadow-lg"
        headerClassName="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)]"
        defaultOpen={false}
        icon={
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      >
        <div className="space-y-2 sm:space-y-3 sm:-mx-2 lg:-mx-4">
          {sortedResults.length > 0 ? (
            sortedResults.map((result, index) => renderResultEntry(result, index + 1))
          ) : (
            <div className="p-3 sm:p-4 text-center bg-gray-50 border border-gray-border/30 rounded-lg">
              <p className="text-sm sm:text-base text-gray-500">Inga resultat ännu</p>
            </div>
          )}
        </div>
      </Collapsible>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-blue" />
        <p className="text-gray-500">Laddar min leaderboard...</p>
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
        <p className="text-gray-500 text-lg">Du har inga resultat ännu</p>
        <p className="text-gray-400 text-sm mt-2">Spela några quiz för att se dina bästa resultat här</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {myLeaderboard.quizzes.map(renderQuizLeaderboard)}
    </div>
  );
}
