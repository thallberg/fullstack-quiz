export const USER_QUIZZES_TEXT = {
    loading: 'Laddar dina quiz...',
  
    empty: {
      title: 'Du har inga quiz ännu',
      subtitle: 'Börja skapa ditt första quiz för att komma igång!',
      button: 'Skapa ditt första quiz',
    },
  
    error: {
      title: 'Kunde inte ladda dina quiz',
      generic: 'Kunde inte ladda dina quiz. Försök igen senare.',
      retry: 'Försök igen',
      delete: 'Kunde inte ta bort quiz',
    },
  
    card: {
      questions: (count: number) =>
        `${count} ${count === 1 ? 'fråga' : 'frågor'}`,
      play: 'Spela',
      edit: 'Redigera',
      delete: 'Ta bort',
    },
  
    dialog: {
      title: 'Ta bort quiz',
      confirm: 'Ta bort',
      cancel: 'Avbryt',
      message: (title: string) =>
        `Är du säker på att du vill ta bort "${title}"? Denna åtgärd kan inte ångras.`,
    },
  } as const;