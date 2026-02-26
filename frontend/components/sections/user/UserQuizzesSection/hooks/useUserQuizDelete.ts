import { useState } from "react";
import { quizDataSource } from "@/lib/data";
import { USER_QUIZZES_TEXT } from "@/content-text/sv/UserQizzes";

interface DeleteDialogState {
  isOpen: boolean;
  quizId: number | null;
  quizTitle: string;
}

interface UseUserQuizDeleteReturn {
  deleteDialog: DeleteDialogState;
  openDeleteDialog: (id: number, title: string) => void;
  closeDeleteDialog: () => void;
  confirmDelete: () => Promise<void>;
}

export function useUserQuizDelete(
  onDeleted: () => Promise<void>,
  setError: (message: string) => void
): UseUserQuizDeleteReturn {
  const [deleteDialog, setDeleteDialog] =
    useState<DeleteDialogState>({
      isOpen: false,
      quizId: null,
      quizTitle: "",
    });

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
      quizTitle: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.quizId) return;

    try {
      await quizDataSource.deleteQuiz(deleteDialog.quizId);
      await onDeleted();
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

  return {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
}