import type { QuestionInput } from "@/components/sections/quiz/CreateQuizSection/create-quiz/types/quizTypes";

export const CREATE_QUIZ_TEXT = {
    form: {
      titleLabel: 'Title',
      titlePlaceholder: 'Enter quiz title',

      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Quiz description (optional)',

      cancel: 'Cancel',
      submit: 'Create Quiz',
    },

    question: {
      addTitle: 'Add new question',
      textLabel: 'Question text',
      textPlaceholder: 'Enter question text',
      correctAnswer: 'Correct answer',
      save: 'Save question',
      clear: 'Clear',
      required: 'Question text is required',
      remove: 'Remove',
      savedTitle: (count: number) => `Saved questions (${count})`,
      correct: 'Correct answer:',
      yes: 'Yes',
      no: 'No',
    },

    validation: {
      titleRequired: 'Title is required',
      minOneQuestion: 'You must add at least one question',
      genericError: 'An error occurred while creating the quiz',
    },

    publicToggle: {
      label: 'Public quiz',
      public: 'Visible to all users',
      private: 'Only visible to you and your friends',
    },

    sectionTitle: 'Create new Quiz',
  } as const;


  export const NEW_QUESTION_TEXT = {
    title: 'Add new question',

    text: {
      label: 'Question text',
      placeholder: 'Enter question text',
    },

    answer: {
      label: 'Correct answer',
      options: [
        {
          label: 'Yes',
          value: true,
          activeClass: 'bg-[var(--color-green)] shadow-xl opacity-100',
          inactiveClass:
            'bg-gray-50 opacity-30 cursor-pointer border border-[var(--color-green)]/50',
        },
        {
          label: 'No',
          value: false,
          activeClass: 'bg-[var(--color-red)] shadow-xl opacity-100',
          inactiveClass:
            'bg-gray-50 opacity-30 cursor-pointer border border-[var(--color-red)]/50',
        },
      ],
    },

    buttons: {
      save: 'Save question',
      clear: 'Clear',
    },
  } as const;

  export const SAVED_QUESTIONS_TEXT = {
    title: (count: number) => `Saved questions (${count})`,
    remove: 'Remove',
    correctLabel: 'Correct answer:',
  } as const;
