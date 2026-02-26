import { useEffect, useState } from "react";
import { quizDataSource } from "@/lib/data";
import { QuizResponseDto } from "@/api-types";
import { USER_QUIZZES_TEXT } from "@/content-text/sv/UserQizzes";

interface UseUserQuizzesReturn {
  quizzes: QuizResponseDto[];
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
}

export function useUserQuizzes(): UseUserQuizzesReturn {
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await quizDataSource.getMyQuizzes();
      setQuizzes(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "";

      // Business rule
      if (
        errorMessage.includes("400") ||
        errorMessage.includes("Bad Request")
      ) {
        setQuizzes([]);
        setError("");
      } else {
        setError(USER_QUIZZES_TEXT.error.generic);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return {
    quizzes,
    isLoading,
    error,
    reload: loadQuizzes,
  };
}