import type { QuestionInput } from "../types/quizTypes"

export type ValidateQuizResult =
  | { success: true }
  | { success: false; message: string }

type CreateQuizValidation = {
  titleRequired: string;
  minOneQuestion: string;
};

export function validateQuiz(
  title: string,
  questions: QuestionInput[],
  validation: CreateQuizValidation
): ValidateQuizResult {
  if (!title.trim()) {
    return {
      success: false,
      message: validation.titleRequired,
    }
  }

  if (questions.length === 0) {
    return {
      success: false,
      message: validation.minOneQuestion,
    }
  }

  return { success: true }
}
