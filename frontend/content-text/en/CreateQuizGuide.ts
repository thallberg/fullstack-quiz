export const CREATE_QUIZ_GUIDE_TEXT = {
    header: {
      title: 'Create your first Quiz! 🎯',
      subtitle: "There are no quizzes yet. Why not create the first one?",
    },

    howItWorks: {
      title: 'How does it work?',
      description:
        'Create your own quiz with yes/no questions. You can add as many questions as you want and set the correct answer for each question.',
      badges: [
        { label: 'Easy to create', variant: 'info' },
        { label: 'Unlimited questions', variant: 'success' },
        { label: 'Share with others', variant: 'warning' },
        { label: 'Yes/No questions', variant: 'default' },
      ] as const,
    },

    steps: {
      title: 'Step by step',
      items: [
        {
          title: 'Give the quiz a title',
          description:
            'Choose a descriptive title that explains what the quiz is about.',
          gradient: 'from-[var(--color-orange)] to-[var(--color-yellow)]',
          border: 'border-[var(--color-orange)]/50',
        },
        {
          title: 'Add questions',
          description:
            'Add as many questions as you want. Each question should be a yes/no question.',
          gradient: 'from-[var(--color-pink)] to-[var(--color-rose)]',
          border: 'border-[var(--color-pink)]/50',
        },
        {
          title: 'Choose the correct answer',
          description:
            'For each question, choose whether the correct answer is "Yes" or "No".',
          gradient: 'from-[var(--color-teal)] to-[var(--color-cyan)]',
          border: 'border-[var(--color-teal)]/50',
        },
      ] as const,
    },

    button: 'Create my first quiz',
  } as const;
