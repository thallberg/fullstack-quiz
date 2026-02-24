'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { QuizResponseDto } from '@/types';
import { USER_QUIZZES_TEXT } from '@/constant/sv/UserQizzes';
import { UserQuizCard } from './UserQuizCard';
import { Button } from '@/components/ui/Button';

export function UserQuizzesSection() {
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
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

      const data = await quizDataSource.getMyQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '';

      if (
        errorMessage.includes('400') ||
        errorMessage.includes('Bad Request')
      ) {
        setQuizzes([]);
        setError('');
      } else {
        setError(USER_QUIZZES_TEXT.error.generic);
      }
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : USER_QUIZZES_TEXT.error.delete
      );
    } finally {
      closeDeleteDialog();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-purple" />
        <p className="text-gray-500">
          {USER_QUIZZES_TEXT.loading}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-text text-lg font-semibold mb-2">
          {USER_QUIZZES_TEXT.error.title}
        </p>

        <p className="text-gray-500 text-sm mb-4">{error}</p>

        <Button
          variant="secondary"
          onClick={loadQuizzes}
        >
          {USER_QUIZZES_TEXT.error.retry}
        </Button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700 text-xl font-semibold mb-2">
          {USER_QUIZZES_TEXT.empty.title}
        </p>

        <p className="text-gray-500 text-base mb-4">
          {USER_QUIZZES_TEXT.empty.subtitle}
        </p>

        <Button
          variant="primary"
          onClick={() => router.push('/create')}
        >
          {USER_QUIZZES_TEXT.empty.button}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <UserQuizCard
            key={quiz.id}
            quiz={quiz}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={USER_QUIZZES_TEXT.dialog.title}
        message={USER_QUIZZES_TEXT.dialog.message(
          deleteDialog.quizTitle
        )}
        confirmText={USER_QUIZZES_TEXT.dialog.confirm}
        cancelText={USER_QUIZZES_TEXT.dialog.cancel}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}