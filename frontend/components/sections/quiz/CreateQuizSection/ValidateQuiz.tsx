import { CREATE_QUIZ_TEXT } from "@/content-text/sv/CreateQuiz";
import type { QuestionInput } from "../quizTypes";

export type ValidateQuizResult =
  | { success: true }
  | { success: false; message: string };

  export function validateQuiz(
    title: string,
    questions: QuestionInput[]
  ): ValidateQuizResult {
    if (!title.trim()) {
      return {
        success: false,
        message: CREATE_QUIZ_TEXT.validation.titleRequired,
      };
    }
  
    if (questions.length === 0) {
      return {
        success: false,
        message: CREATE_QUIZ_TEXT.validation.minOneQuestion,
      };
    }
  
    return { success: true };
  }