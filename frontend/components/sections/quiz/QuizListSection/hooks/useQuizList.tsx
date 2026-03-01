import { useEffect, useState } from "react";
import { quizDataSource } from "@/lib/data";
import { GroupedQuizzesDto } from "@/api-types";
import { useContent } from "@/contexts/LocaleContext";

export function useQuizList() {
  const { QUIZ_LIST_TEXT } = useContent();
  const [groupedQuizzes, setGroupedQuizzes] =
    useState<GroupedQuizzesDto>({
      myQuizzes: [],
      friendsQuizzes: [],
      publicQuizzes: [],
    });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await quizDataSource.getAllQuizzes();

      setGroupedQuizzes({
        myQuizzes: data?.myQuizzes ?? [],
        friendsQuizzes: data?.friendsQuizzes ?? [],
        publicQuizzes: data?.publicQuizzes ?? [],
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : QUIZ_LIST_TEXT.loadError
      );
      setGroupedQuizzes({
        myQuizzes: [],
        friendsQuizzes: [],
        publicQuizzes: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return {
    groupedQuizzes,
    isLoading,
    error,
    reload: loadQuizzes,
  };
}