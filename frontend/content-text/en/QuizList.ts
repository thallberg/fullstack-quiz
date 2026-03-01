export const QUIZ_LIST_TEXT = {
  deleteDialog: {
    title: "Delete quiz",
    message: (title: string) =>
      `Are you sure you want to delete "${title}"?`,
    confirm: "Delete",
    cancel: "Cancel",
  },
  loadError: "Could not load quiz",
  card: {
    play: "Play",
    edit: "Edit",
    delete: "Delete",
    question: "question",
    questions: "questions",
    createdBy: (username: string) => `Created by ${username}`,
    private: "Private",
  },
} as const
