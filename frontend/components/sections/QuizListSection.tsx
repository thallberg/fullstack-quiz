'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { quizDataSource } from '@/lib/data';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
import type { QuizResponseDto } from '@/types';

export function QuizListSection() {
  const router = useRouter();
  const { user } = useAuth();
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
      const data = await quizDataSource.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div className="p-4 bg-gray-50 border border-red-border rounded-lg">
        <p className="text-red-text">{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Inga quiz hittades</p>
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
        {quizzes.map((quiz) => {
          const isOwner = user?.id === quiz.userId;

          const cardColors = [
            'border-blue-border',
            'border-purple-border',
            'border-pink-border',
            'border-green-border',
            'border-yellow-border',
          ];
          const cardColor = cardColors[quiz.id % cardColors.length];

          return (
            <Card key={quiz.id} className={`${cardColor} shadow-lg hover:shadow-xl transition-shadow`}>
              <CardBody>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent mb-2 break-words">
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p className="text-sm sm:text-base text-gray-500 mb-3 break-words">{quiz.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="info">
                        {quiz.questions.length} {quiz.questions.length === 1 ? 'fråga' : 'frågor'}
                      </Badge>
                      <Badge variant="default">
                        Skapad av {quiz.username}
                      </Badge>
                      <Badge variant="default">
                        {formatDate(quiz.createdAt)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="p-3 sm:p-6">
                <div className="flex flex-wrap justify-end gap-2 w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quiz.id}/play`)}
                    className="text-xs sm:text-sm"
                  >
                    Spela
                  </Button>
                  {isOwner && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
                        className="text-xs sm:text-sm"
                      >
                        Redigera
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteDialog(quiz.id, quiz.title)}
                        className="text-xs sm:text-sm"
                      >
                        Ta bort
                      </Button>
                    </>
                  )}
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
