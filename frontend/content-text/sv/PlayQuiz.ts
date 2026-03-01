export const PLAY_QUIZ_TEXT = {
  loading: "Laddar quiz...",
  loadError: "Kunde inte ladda quiz",
  questionProgress: (current: number, total: number) =>
    `Fråga ${current} av ${total}`,
  result: {
    title: "Resultat",
    scoreSuffix: "rätt",
    backToQuizzes: "Tillbaka till alla quiz",
    playAgain: "Spela igen",
    seeAllQuestions: "Se alla frågor och svar",
    yourAnswer: "Ditt svar:",
    correctAnswer: "Rätt svar:",
    noAnswer: "Inget svar",
    yes: "Ja",
    no: "Nej",
  },
  resultMessages: {
    perfect: "Perfekt! Du fick alla rätt! 🎉",
    excellent: "Utmärkt jobbat! Nästan perfekt! 🌟",
    good: "Bra jobbat! Du är på rätt väg! 👍",
    keepTrying: "Bra försök! Fortsätt öva så blir det bättre! 💪",
    practice: "Fortsätt öva! Du kan klara det! 📚",
  },
  saveError: {
    loginAgain: "Logga in igen för att spara resultatet.",
    serverError:
      "Kunde inte nå servern. Resultatet sparades inte men du kan se dina svar nedan.",
    generic: (msg: string) => `Resultatet kunde inte sparas: ${msg}`,
  },
  pieChartAria: "Resultat tårtdiagram",
} as const
