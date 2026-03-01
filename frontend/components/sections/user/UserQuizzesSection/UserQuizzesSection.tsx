"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { UserQuizCard } from "./UserQuizCard";
import { useUserQuizzes } from "./hooks/useUserQuizzes";
import { useUserQuizDelete } from "./hooks/useUserQuizDelete";
import { useContent } from "@/contexts/LocaleContext";

export function UserQuizzesSection() {
  const router = useRouter();
  const { USER_QUIZZES_TEXT } = useContent();

  const {
    quizzes,
    isLoading,
    error,
    reload,
  } = useUserQuizzes();

  const {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  } = useUserQuizDelete(reload, () => {});

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
        <Button variant="secondary" onClick={reload}>
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
          onClick={() => router.push("/create")}
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
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}