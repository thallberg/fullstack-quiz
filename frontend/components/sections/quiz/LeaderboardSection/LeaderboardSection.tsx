"use client";

import { Spinner } from "@/components/ui/Spinner";
import { Collapsible } from "@/components/ui/Collapsible";
import { Badge } from "@/components/ui/Badge";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useMedalIcon } from "@/hooks/useMedalIcon";
import { LeaderboardQuiz } from "./LeaderboardQuiz";
import { LEADERBOARD_GROUPS } from "./leaderboard.config";
import { useLeaderboard } from "./hooks/useLeadeboard";

export function LeaderboardSection() {
  const formatDate = useDateFormatter();
  const getMedalIcon = useMedalIcon();
  const { leaderboard, isLoading, error } =
    useLeaderboard();

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      {LEADERBOARD_GROUPS.map((group) => {
        const quizzes = leaderboard[group.key] ?? [];

        if (quizzes.length === 0) return null;

        return (
          <Collapsible
            key={group.key}
            title={
              <span className="flex items-center gap-2">
                {group.title}
                <Badge variant="default">
                  {quizzes.length} quiz
                </Badge>
              </span>
            }
            defaultOpen={group.defaultOpen}
          >
            <div className="space-y-4">
              {quizzes.map((entry) => (
                <LeaderboardQuiz
                  key={entry.quizId}
                  entry={entry}
                  getMedalIcon={getMedalIcon}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}