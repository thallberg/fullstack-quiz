'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { quizDataSource } from '@/lib/data';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useQuizCardColor } from '@/hooks/useQuizCardColor';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import type { QuizResponseDto, GroupedQuizzesDto } from '@/types';
import { QuizCard } from './QuizCard';
import { QuizGroup } from './QuizGroup';

export function QuizListSection() {
  const router = useRouter();
  const { user } = useAuth();
  const formatDate = useDateFormatter();
  const getCardColor = useQuizCardColor();
  const [groupedQuizzes, setGroupedQuizzes] = useState<GroupedQuizzesDto>({
    myQuizzes: [],
    friendsQuizzes: [],
    publicQuizzes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    quizId: number | null;
    quizTitle: string;
  }>({
    isOpen: false,
    quizId: null,
    quizTitle: '',
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await quizDataSource.getAllQuizzes();
      setGroupedQuizzes({
        myQuizzes: data?.myQuizzes || [],
        friendsQuizzes: data?.friendsQuizzes || [],
        publicQuizzes: data?.publicQuizzes || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
      setGroupedQuizzes({ myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (id: number, title: string) => {
    setDeleteDialog({
      isOpen: true,
      quizId: id,
      quizTitle: title,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      quizId: null,
      quizTitle: '',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.quizId) return;

    try {
      await quizDataSource.deleteQuiz(deleteDialog.quizId);
      await loadQuizzes();
      closeDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort quiz');
      closeDeleteDialog();
    }
  };

  const totalQuizzes = (groupedQuizzes?.myQuizzes?.length || 0) + (groupedQuizzes?.friendsQuizzes?.length || 0) + (groupedQuizzes?.publicQuizzes?.length || 0);

  const renderQuizCard = (quiz: QuizResponseDto) => {
    const isOwner = user?.id === quiz.userId;
    const cardColor = getCardColor(quiz.id);

    return (
      <QuizCard
        key={quiz.id}
        quiz={quiz}
        isOwner={isOwner}
        cardColor={cardColor}
        formatDate={formatDate}
        onPlay={() => router.push(`/quiz/${quiz.id}/play`)}
        onEdit={() => router.push(`/quiz/${quiz.id}/edit`)}
        onDelete={() => openDeleteDialog(quiz.id, quiz.title)}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-blue" />
        <p className="text-gray-500">Laddar quiz...</p>
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

  if (totalQuizzes === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Inga quiz hittades ännu</p>
        {user && (
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push('/create')}
          >
            Skapa första quizet
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <QuizGroup
          title={
            <span className="flex items-center gap-2">
              Mina Quiz
              <Badge variant="default" className="text-xs">
                {groupedQuizzes.myQuizzes.length} {groupedQuizzes.myQuizzes.length === 1 ? 'quiz' : 'quiz'}
              </Badge>
            </span>
          }
          quizzes={Array.isArray(groupedQuizzes.myQuizzes) ? groupedQuizzes.myQuizzes : []}
          className="border-[var(--color-blue)]/50"
          headerClassName="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)]"
          defaultOpen={true}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          renderCard={renderQuizCard}
        />

        <QuizGroup
          title={
            <span className="flex items-center gap-2">
              Quiz skapade av mina vänner
              <Badge variant="default" className="text-xs">
                {groupedQuizzes.friendsQuizzes.length} {groupedQuizzes.friendsQuizzes.length === 1 ? 'quiz' : 'quiz'}
              </Badge>
            </span>
          }
          quizzes={Array.isArray(groupedQuizzes.friendsQuizzes) ? groupedQuizzes.friendsQuizzes : []}
          className="border-[var(--color-green)]/50"
          headerClassName="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)]"
          defaultOpen={false}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          renderCard={renderQuizCard}
        />

        <QuizGroup
          title={
            <span className="flex items-center gap-2">
              Andra publika quiz
              <Badge variant="default" className="text-xs">
                {groupedQuizzes.publicQuizzes.length} {groupedQuizzes.publicQuizzes.length === 1 ? 'quiz' : 'quiz'}
              </Badge>
            </span>
          }
          quizzes={Array.isArray(groupedQuizzes.publicQuizzes) ? groupedQuizzes.publicQuizzes : []}
          className="border-[var(--color-purple)]/50"
          headerClassName="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)]"
          defaultOpen={!Array.isArray(groupedQuizzes.myQuizzes) || groupedQuizzes.myQuizzes.length === 0}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          renderCard={renderQuizCard}
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Ta bort quiz"
        message={`Är du säker på att du vill ta bort "${deleteDialog.quizTitle}"? Denna åtgärd kan inte ångras.`}
        confirmText="Ta bort"
        cancelText="Avbryt"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}
