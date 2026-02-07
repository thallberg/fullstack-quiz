'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useQuizCardColor } from '@/hooks/useQuizCardColor';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { QuizResponseDto } from '@/types';

export function UserQuizzesSection() {
  const router = useRouter();
  const formatDate = useDateFormatter();
  const getCardColor = useQuizCardColor();
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
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        setQuizzes([]);
        setError('');
      } else {
        setError('Kunde inte ladda dina quiz. Försök igen senare.');
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
      closeDeleteDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort quiz');
      closeDeleteDialog();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-purple" />
        <p className="text-gray-500">Laddar dina quiz...</p>
      </div>
    );
  }

  if (quizzes.length === 0 && !error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-700 text-xl font-semibold mb-2">Du har inga quiz ännu</p>
          <p className="text-gray-500 text-base">Börja skapa ditt första quiz för att komma igång!</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/create')}
          className="py-3 text-lg px-8"
        >
          Skapa ditt första quiz
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-text text-lg font-semibold mb-2">Kunde inte ladda dina quiz</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
        </div>
        <Button
          variant="secondary"
          onClick={loadQuizzes}
          className="py-2 text-base"
        >
          Försök igen
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {quizzes.map((quiz) => {
          const cardColor = getCardColor(quiz.id);

          return (
            <Card key={quiz.id} className={`${cardColor} shadow-lg hover:shadow-xl transition-shadow`}>
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-purple)] bg-clip-text text-transparent mb-2">
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p className="text-gray-500 mb-3">{quiz.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="info">
                        {quiz.questions.length} {quiz.questions.length === 1 ? 'fråga' : 'frågor'}
                      </Badge>
                      <Badge variant="default">
                        {formatDate(quiz.createdAt)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex justify-end space-x-2 w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quiz.id}/play`)}
                  >
                    Spela
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
                  >
                    Redigera
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteDialog(quiz.id, quiz.title)}
                  >
                    Ta bort
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
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
