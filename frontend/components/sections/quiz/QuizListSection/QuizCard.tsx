import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { QuizResponseDto } from '@/types';

interface QuizCardProps {
  quiz: QuizResponseDto;
  isOwner: boolean;
  cardColor: string;
  formatDate: (dateString: string) => string;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuizCard({
  quiz,
  isOwner,
  cardColor,
  formatDate,
  onPlay,
  onEdit,
  onDelete,
}: QuizCardProps) {
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

  return (
    <Card key={quiz.id} className={`${cardColor} shadow-lg hover:shadow-xl transition-shadow rounded-none sm:rounded-lg`}>
      <CardBody className="!p-2 sm:!p-4 lg:!p-6">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent mb-2 break-words">
              {quiz.title}
            </h3>
            {quiz.description && (
              <p className="text-sm sm:text-base text-gray-500 mb-3 break-words">{quiz.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">
                {questionCount} {questionCount === 1 ? 'fråga' : 'frågor'}
              </Badge>
              {!isOwner && (
                <Badge variant="default">
                  Skapad av {quiz.username}
                </Badge>
              )}
              <Badge variant="default">
                {formatDate(quiz.createdAt)}
              </Badge>
              {!quiz.isPublic && (
                <Badge variant="default" className="bg-orange text-white">
                  Privat
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="!p-2 sm:!p-4 lg:!p-6">
        <div className="flex flex-wrap justify-start gap-4 w-full">
          <Button
            variant="primary"
            size="sm"
            onClick={onPlay}
            className="text-xs sm:text-sm"
          >
            Spela
          </Button>
          {isOwner && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="text-xs sm:text-sm"
              >
                Redigera
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
                className="text-xs sm:text-sm"
              >
                Ta bort
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
