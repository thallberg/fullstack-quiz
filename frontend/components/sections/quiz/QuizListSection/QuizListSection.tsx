"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useQuizCardColor } from "@/hooks/useQuizCardColor";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QuizCard } from "./QuizCard";
import { useQuizList } from "./hooks/useQuizList";
import { QuizGroupsRenderer } from "./hooks/useQuizGroupRenderer";
import { useQuizDelete } from "./hooks/useQuizDelete";
import { QuizResponseDto } from "@/api-types";
import { useContent } from "@/contexts/LocaleContext";


export function QuizListSection() {
  const router = useRouter();
  const { user } = useAuth();
  const formatDate = useDateFormatter();
  const getCardColor = useQuizCardColor();
  const { QUIZ_LIST_TEXT } = useContent();

  const { groupedQuizzes, isLoading, error, reload } =
    useQuizList();

  const {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  } = useQuizDelete(reload);

  const renderQuizCard = (quiz: QuizResponseDto) => {
    const isOwner = user?.id === quiz.userId;

    return (
      <QuizCard
        key={quiz.id}
        quiz={quiz}
        isOwner={isOwner}
        cardColor={getCardColor(quiz.id)}
        formatDate={formatDate}
        onPlay={() => router.push(`/quiz/${quiz.id}/play`)}
        onEdit={() => router.push(`/quiz/${quiz.id}/edit`)}
        onDelete={() =>
          openDeleteDialog(quiz.id, quiz.title)
        }
      />
    );
  };

  if (isLoading) return <Spinner size="lg" />;

  if (error) return <div>{error}</div>;

  return (
    <>
      <QuizGroupsRenderer
        groupedQuizzes={groupedQuizzes}
        renderCard={renderQuizCard}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={QUIZ_LIST_TEXT.deleteDialog.title}
        message={QUIZ_LIST_TEXT.deleteDialog.message(deleteDialog.quizTitle)}
        confirmText={QUIZ_LIST_TEXT.deleteDialog.confirm}
        cancelText={QUIZ_LIST_TEXT.deleteDialog.cancel}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}

