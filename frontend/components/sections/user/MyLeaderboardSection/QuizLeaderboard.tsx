import { Badge } from '@/components/ui/Badge';
import { Collapsible } from '@/components/ui/Collapsible';
import type { QuizLeaderboardEntryDto } from '@/types';
import { ResultCard } from './ResultCard';
import { sortResults } from './utils';
import { LEADERBOARD_TEXT } from '@/constant/sv/Leaderboard';

interface Props {
  entry: QuizLeaderboardEntryDto;
}

export function QuizLeaderboardCard({ entry }: Props) {
  const sortedResults = sortResults(entry.results || []);

  return (
    <Collapsible
      title={
        <span className="flex items-center gap-2 flex-wrap">
          <span className="break-words">{entry.quizTitle}</span>

          <Badge variant="info" className="text-xs shrink-0">
            {sortedResults.length} {LEADERBOARD_TEXT.resultsLabel}
          </Badge>
        </span>
      }
      className="border-[var(--color-purple)]/50 shadow-lg"
      headerClassName="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)]"
      defaultOpen={false}
    >
      <div className="space-y-2 sm:space-y-3">
        {sortedResults.length > 0 ? (
          sortedResults.map((result, index) => (
            <ResultCard
              key={result.resultId}
              result={result}
              position={index + 1}
            />
          ))
        ) : (
          <div className="p-4 text-center bg-gray-50 border border-gray-border/30 rounded-lg">
            <p className="text-sm sm:text-base text-gray-500">
              {LEADERBOARD_TEXT.empty.noResults}
            </p>
          </div>
        )}
      </div>
    </Collapsible>
  );
}