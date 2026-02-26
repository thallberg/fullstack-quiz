import { Badge } from '@/components/ui/Badge';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useMedalIcon } from '@/hooks/useMedalIcon';
import type { QuizResultEntryDto } from '@/api-types';

interface ResultCardProps {
  result: QuizResultEntryDto;
  position: number;
}

export function ResultCard({ result, position }: ResultCardProps) {
  const formatDate = useDateFormatter();
  const getMedalIcon = useMedalIcon();

  const variantStyles = {
    1: 'bg-yellow-50 border-yellow-border/50',
    2: 'bg-gray-50 border-gray-border/50',
    3: 'bg-orange-50 border-orange-border/50',
  };

  const style =
    variantStyles[position as 1 | 2 | 3] ??
    'bg-gray-50 border-gray-border/30';

  return (
    <div className={`p-3 sm:p-4 rounded-lg border ${style}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-base sm:text-lg md:text-xl font-bold text-gray-700 shrink-0">
            {getMedalIcon(position)}
          </span>

          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 break-words">
            {result.percentage}%
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <Badge variant="success" className="bg-green text-white text-xs sm:text-sm">
            {result.score}/{result.totalQuestions}
          </Badge>

          {result.completedAt && (
            <Badge variant="info" className="hidden sm:inline-flex text-xs">
              {formatDate(result.completedAt)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}