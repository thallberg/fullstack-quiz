import type { QuestionInput } from "@/components/sections/quiz/CreateQuizSection/create-quiz/types/quizTypes";

export const CREATE_QUIZ_TEXT = {
    form: {
      titleLabel: 'Titel',
      titlePlaceholder: 'Ange quiz-titel',
  
      descriptionLabel: 'Beskrivning',
      descriptionPlaceholder: 'Beskrivning av quizet (valfritt)',
  
      cancel: 'Avbryt',
      submit: 'Skapa Quiz',
    },
  
    question: {
      addTitle: 'Lägg till ny fråga',
      textLabel: 'Frågetext',
      textPlaceholder: 'Ange frågetext',
      correctAnswer: 'Rätt svar',
      save: 'Spara fråga',
      clear: 'Rensa',
      required: 'Frågetext är obligatorisk',
      remove: 'Ta bort',
      savedTitle: (count: number) => `Sparade frågor (${count})`,
      correct: 'Rätt svar:',
      yes: 'Ja',
      no: 'Nej',
    },
  
    validation: {
      titleRequired: 'Titel är obligatorisk',
      minOneQuestion: 'Du måste lägga till minst en fråga',
      genericError: 'Ett fel uppstod vid skapande av quiz',
    },
  
    publicToggle: {
      label: 'Publikt quiz',
      public: 'Synligt för alla användare',
      private: 'Endast synligt för dig och dina vänner',
    },
  
    sectionTitle: 'Skapa nytt Quiz',
  } as const;


  export const NEW_QUESTION_TEXT = {
    title: 'Lägg till ny fråga',
  
    text: {
      label: 'Frågetext',
      placeholder: 'Ange frågetext',
    },
  
    answer: {
      label: 'Rätt svar',
      options: [
        {
          label: 'Ja',
          value: true,
          activeClass: 'bg-[var(--color-green)] shadow-xl opacity-100',
          inactiveClass:
            'bg-gray-50 opacity-30 cursor-pointer border border-[var(--color-green)]/50',
        },
        {
          label: 'Nej',
          value: false,
          activeClass: 'bg-[var(--color-red)] shadow-xl opacity-100',
          inactiveClass:
            'bg-gray-50 opacity-30 cursor-pointer border border-[var(--color-red)]/50',
        },
      ],
    },
  
    buttons: {
      save: 'Spara fråga',
      clear: 'Rensa',
    },
  } as const;

  export const SAVED_QUESTIONS_TEXT = {
    title: (count: number) => `Sparade frågor (${count})`,
    remove: 'Ta bort',
    correctLabel: 'Rätt svar:',
  } as const;