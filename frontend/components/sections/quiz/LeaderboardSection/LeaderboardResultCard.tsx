import { Badge } from "@/components/ui/Badge";
import type { QuizResultEntryDto } from "@/types";

interface Props {
  result: QuizResultEntryDto;
  position: number;
  getMedalIcon: (pos: number) => React.ReactNode;
  formatDate: (date: string) => string;
}

export function LeaderboardResultCard({
  result,
  position,
  getMedalIcon,
  formatDate,
}: Props) {
  const borderClass =
    position === 1
      ? "bg-yellow-50 border-yellow-border/50"
      : position === 2
      ? "bg-gray-50 border-gray-border/50"
      : position === 3
      ? "bg-orange-50 border-orange-border/50"
      : "bg-gray-50 border-gray-border/30";

  return (
    <div
      key={result.resultId}
      className={`p-3 sm:p-4 rounded-lg border ${borderClass}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold">
            {getMedalIcon(position)}
          </span>
          <p className="font-semibold">
            {result.username}
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="success">
            {result.percentage}%
          </Badge>

          <Badge variant="default">
            {result.score}/{result.totalQuestions}
          </Badge>

          {result.completedAt && (
            <Badge variant="info">
              {formatDate(result.completedAt)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}