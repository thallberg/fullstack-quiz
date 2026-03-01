import { useState } from "react";
import { quizDataSource } from "@/lib/data";
import type { DeleteDialogState, UseQuizDeleteReturn } from "../types/quizList.types";

export function useQuizDelete(
  onDeleted: () => Promise<void>
): UseQuizDeleteReturn {
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

    await quizDataSource.deleteQuiz(deleteDialog.quizId);
    closeDeleteDialog();
    await onDeleted();
  };

  return {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
}