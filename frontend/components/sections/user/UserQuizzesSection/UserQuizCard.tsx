import { useRouter } from 'next/navigation';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useQuizCardColor } from '@/hooks/useQuizCardColor';
import type { QuizResponseDto } from '@/types';
import { USER_QUIZZES_TEXT } from '@/constant/sv/UserQizzes';

interface Props {
  quiz: QuizResponseDto;
  onDelete: (id: number, title: string) => void;
}

export function UserQuizCard({ quiz, onDelete }: Props) {
  const router = useRouter();
  const formatDate = useDateFormatter();
  const getCardColor = useQuizCardColor();

  const cardColor = getCardColor(quiz.id);

  return (
    <Card className={`${cardColor} shadow-lg hover:shadow-xl transition-shadow`}>
      <CardBody>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-purple)] bg-clip-text text-transparent mb-2">
              {quiz.title}
            </h3>

            {quiz.description && (
              <p className="text-gray-500 mb-3">{quiz.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">
                {USER_QUIZZES_TEXT.card.questions(
                  quiz.questions.length
                )}
              </Badge>

              <Badge variant="default">
                {formatDate(quiz.createdAt)}
              </Badge>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex justify-end space-x-2 w-full">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/quiz/${quiz.id}/play`)}
          >
            {USER_QUIZZES_TEXT.card.play}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/quiz/${quiz.id}/edit`)}
          >
            {USER_QUIZZES_TEXT.card.edit}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(quiz.id, quiz.title)}
          >
            {USER_QUIZZES_TEXT.card.delete}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}