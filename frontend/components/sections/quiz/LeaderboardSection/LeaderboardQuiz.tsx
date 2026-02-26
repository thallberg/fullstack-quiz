import { Collapsible } from "@/components/ui/Collapsible";
import { Badge } from "@/components/ui/Badge";
import { LeaderboardResultCard } from "./LeaderboardResultCard";
import { QuizLeaderboardEntryDto } from "@/api-types";

interface Props {
  entry: QuizLeaderboardEntryDto;
  getMedalIcon: (pos: number) => React.ReactNode;
  formatDate: (date: string) => string;
}

export function LeaderboardQuiz({
  entry,
  getMedalIcon,
  formatDate,
}: Props) {
  const sorted = [...(entry.results ?? [])].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return (
      new Date(b.completedAt).getTime() -
      new Date(a.completedAt).getTime()
    );
  });

  return (
    <Collapsible
      title={
        <span className="flex items-center gap-2">
          {entry.quizTitle}
          <Badge variant="info">
            {sorted.length} resultat
          </Badge>
        </span>
      }
      className="border-[var(--color-purple)]/50 shadow-lg"
      headerClassName="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white"
      defaultOpen={false}
    >
      <div className="space-y-3">
        {sorted.map((result, index) => (
          <LeaderboardResultCard
            key={result.resultId}
            result={result}
            position={index + 1}
            getMedalIcon={getMedalIcon}
            formatDate={formatDate}
          />
        ))}
      </div>
    </Collapsible>
  );
}