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
import { Collapsible } from '../ui/Collapsible';
import type { QuizResponseDto, GroupedQuizzesDto } from '@/types';

export function QuizListSection() {
  const router = useRouter();
  const { user } = useAuth();
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
      // Ensure data has required properties with defaults
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalQuizzes = (groupedQuizzes?.myQuizzes?.length || 0) + (groupedQuizzes?.friendsQuizzes?.length || 0) + (groupedQuizzes?.publicQuizzes?.length || 0);

  // Helper function to render quiz cards
  const renderQuizCards = (quizzes: QuizResponseDto[]) => {
    return quizzes.map((quiz) => {
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
                  {!isOwner && (
                    <Badge variant="default">
                      Skapad av {quiz.username}
                    </Badge>
                  )}
                  <Badge variant="default">
                    {formatDate(quiz.createdAt)}
                  </Badge>
                  {!quiz.isPublic && (
                    <Badge variant="default" className="bg-orange text-white">
                      Privat
                    </Badge>
                  )}
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

  if (totalQuizzes === 0) {
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
        {/* Mina Quiz - Always first if exists */}
        {groupedQuizzes.myQuizzes.length > 0 && (
          <Collapsible
            title={
              <span className="flex items-center gap-2">
                Mina Quiz
                <Badge variant="default" className="text-xs">
                  {groupedQuizzes.myQuizzes.length} {groupedQuizzes.myQuizzes.length === 1 ? 'quiz' : 'quiz'}
                </Badge>
              </span>
            }
            className="border-blue-border/50"
            headerClassName="bg-gradient-to-r from-blue to-indigo text-white border-blue-dark"
            defaultOpen={true}
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <div className="space-y-4">
              {renderQuizCards(groupedQuizzes.myQuizzes)}
            </div>
          </Collapsible>
        )}

        {/* Vänners Quiz */}
        {groupedQuizzes.friendsQuizzes.length > 0 && (
          <Collapsible
            title={
              <span className="flex items-center gap-2">
                Quiz skapade av mina vänner
                <Badge variant="default" className="text-xs">
                  {groupedQuizzes.friendsQuizzes.length} {groupedQuizzes.friendsQuizzes.length === 1 ? 'quiz' : 'quiz'}
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
            <div className="space-y-4">
              {renderQuizCards(groupedQuizzes.friendsQuizzes)}
            </div>
          </Collapsible>
        )}

        {/* Publika Quiz */}
        {groupedQuizzes.publicQuizzes.length > 0 && (
          <Collapsible
            title={
              <span className="flex items-center gap-2">
                Andra publika quiz
                <Badge variant="default" className="text-xs">
                  {groupedQuizzes.publicQuizzes.length} {groupedQuizzes.publicQuizzes.length === 1 ? 'quiz' : 'quiz'}
                </Badge>
              </span>
            }
            className="border-purple-border/50"
            headerClassName="bg-gradient-to-r from-purple to-pink text-white border-purple-dark"
            defaultOpen={groupedQuizzes.myQuizzes.length === 0}
            icon={
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              {renderQuizCards(groupedQuizzes.publicQuizzes)}
            </div>
          </Collapsible>
        )}
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
