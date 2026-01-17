'use client';

import { useEffect, useState } from 'react';
import { quizDataSource } from '@/lib/data';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { Collapsible } from '../ui/Collapsible';
import type { LeaderboardDto, QuizLeaderboardEntryDto } from '@/types';

export function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardDto>({
    myQuizzes: [],
    friendsQuizzes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await quizDataSource.getLeaderboard();
      setLeaderboard({
        myQuizzes: data?.myQuizzes || [],
        friendsQuizzes: data?.friendsQuizzes || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderLeaderboardEntry = (entry: QuizLeaderboardEntryDto) => {
    const hasResult = entry.bestUsername !== undefined && entry.bestScore !== undefined;

    return (
      <Card key={entry.quizId} className="border-gray-border shadow-lg hover:shadow-xl transition-shadow rounded-none sm:rounded-lg">
        <CardBody className="!p-2 sm:!p-4 lg:!p-6">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent mb-2 break-words">
                {entry.quizTitle}
              </h3>
              {hasResult ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success" className="bg-green text-white">
                    Bästa resultat: {entry.bestPercentage}%
                  </Badge>
                  <Badge variant="default">
                    {entry.bestScore} korrekta
                  </Badge>
                  <Badge variant="default">
                    {entry.bestUsername}
                  </Badge>
                  {entry.bestCompletedAt && (
                    <Badge variant="default">
                      {formatDate(entry.bestCompletedAt)}
                    </Badge>
                  )}
                  <Badge variant="info">
                    {entry.totalAttempts} {entry.totalAttempts === 1 ? 'försök' : 'försök'}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-gray-400 text-white">
                    Inga resultat ännu
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-blue" />
        <p className="text-gray-500">Laddar leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 border border-red-border rounded-lg">
        <p className="text-red-text">{error}</p>
      </div>
    );
  }

  const totalQuizzes = leaderboard.myQuizzes.length + leaderboard.friendsQuizzes.length;

  if (totalQuizzes === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Inga quiz att visa leaderboard för ännu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mina Quiz Leaderboard */}
      {Array.isArray(leaderboard.myQuizzes) && leaderboard.myQuizzes.length > 0 && (
        <Collapsible
          title={
            <span className="flex items-center gap-2">
              Mina Quiz Leaderboard
              <Badge variant="default" className="text-xs">
                {leaderboard.myQuizzes.length} {leaderboard.myQuizzes.length === 1 ? 'quiz' : 'quiz'}
              </Badge>
            </span>
          }
          className="border-blue-border/50"
          headerClassName="bg-gradient-to-r from-blue to-indigo text-white border-blue-dark"
          defaultOpen={true}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        >
          <div className="space-y-4 sm:-mx-2 lg:-mx-4">
            {leaderboard.myQuizzes.map(renderLeaderboardEntry)}
          </div>
        </Collapsible>
      )}

      {/* Vänners Quiz Leaderboard */}
      {Array.isArray(leaderboard.friendsQuizzes) && leaderboard.friendsQuizzes.length > 0 && (
        <Collapsible
          title={
            <span className="flex items-center gap-2">
              Vänners Quiz Leaderboard
              <Badge variant="default" className="text-xs">
                {leaderboard.friendsQuizzes.length} {leaderboard.friendsQuizzes.length === 1 ? 'quiz' : 'quiz'}
              </Badge>
            </span>
          }
          className="border-green-border/50"
          headerClassName="bg-gradient-to-r from-green to-emerald text-white border-green-dark"
          defaultOpen={false}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          <div className="space-y-4 sm:-mx-2 lg:-mx-4">
            {leaderboard.friendsQuizzes.map(renderLeaderboardEntry)}
          </div>
        </Collapsible>
      )}
    </div>
  );
}
