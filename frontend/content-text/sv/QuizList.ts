export const QUIZ_LIST_TEXT = {
  deleteDialog: {
    title: "Ta bort quiz",
    message: (title: string) =>
      `Är du säker på att du vill ta bort "${title}"?`,
    confirm: "Ta bort",
    cancel: "Avbryt",
  },
  loadError: "Kunde inte ladda quiz",
  card: {
    play: "Spela",
    edit: "Redigera",
    delete: "Ta bort",
    question: "fråga",
    questions: "frågor",
    createdBy: (username: string) => `Skapad av ${username}`,
    private: "Privat",
  },
} as const
