import { useEffect, useState } from "react";
import { quizDataSource } from "@/lib/data";
import { LeaderboardDto } from "@/api-types";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardDto>({
      myQuizzes: [],
      friendsQuizzes: [],
      publicQuizzes: [],
    });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await quizDataSource.getLeaderboard();

      setLeaderboard({
        myQuizzes: data?.myQuizzes ?? [],
        friendsQuizzes: data?.friendsQuizzes ?? [],
        publicQuizzes: data?.publicQuizzes ?? [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kunde inte ladda leaderboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { leaderboard, isLoading, error };
}