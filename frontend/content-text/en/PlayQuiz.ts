export const PLAY_QUIZ_TEXT = {
  loading: "Loading quiz...",
  loadError: "Could not load quiz",
  questionProgress: (current: number, total: number) =>
    `Question ${current} of ${total}`,
  result: {
    title: "Result",
    scoreSuffix: "correct",
    backToQuizzes: "Back to all quizzes",
    playAgain: "Play again",
    seeAllQuestions: "See all questions and answers",
    yourAnswer: "Your answer:",
    correctAnswer: "Correct answer:",
    noAnswer: "No answer",
    yes: "Yes",
    no: "No",
  },
  resultMessages: {
    perfect: "Perfect! You got them all right! 🎉",
    excellent: "Excellent! Almost perfect! 🌟",
    good: "Well done! You're on the right track! 👍",
    keepTrying: "Good try! Keep practising and you'll get better! 💪",
    practice: "Keep practising! You can do it! 📚",
  },
  saveError: {
    loginAgain: "Log in again to save your result.",
    serverError:
      "Could not reach the server. Your result was not saved but you can see your answers below.",
    generic: (msg: string) => `Result could not be saved: ${msg}`,
  },
  pieChartAria: "Result pie chart",
} as const
