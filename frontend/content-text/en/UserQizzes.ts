export const USER_QUIZZES_TEXT = {
    loading: 'Loading your quizzes...',

    empty: {
      title: "You don't have any quizzes yet",
      subtitle: 'Start by creating your first quiz to get started!',
      button: 'Create your first quiz',
    },

    error: {
      title: 'Could not load your quizzes',
      generic: 'Could not load your quizzes. Please try again later.',
      retry: 'Try again',
      delete: 'Could not delete quiz',
    },

    card: {
      questions: (count: number) =>
        `${count} ${count === 1 ? 'question' : 'questions'}`,
      play: 'Play',
      edit: 'Edit',
      delete: 'Delete',
    },

    dialog: {
      title: 'Delete quiz',
      confirm: 'Delete',
      cancel: 'Cancel',
      message: (title: string) =>
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    },
  } as const;
