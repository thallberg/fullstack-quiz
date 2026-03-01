import type { QuestionInput } from "../types/quizTypes"

export function createEmptyQuestion(): QuestionInput {
  return {
    id: "",
    text: "",
    correctAnswer: false,
  }
}
