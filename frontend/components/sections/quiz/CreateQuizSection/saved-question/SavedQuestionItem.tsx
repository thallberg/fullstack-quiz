import { Button } from '@/components/ui/Button';
import { useContent } from '@/contexts/LocaleContext';
import type { SavedQuestionItemProps } from './types/savedQuestion.types';

export function SavedQuestionItem({
  question,
  index,
  onRemove,
}: SavedQuestionItemProps) {
  const { SAVED_QUESTIONS_TEXT, CREATE_QUIZ_TEXT } = useContent();
  const isCorrect = question.correctAnswer;

  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-300/50 rounded-lg bg-gray-50">
      <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 break-words">
          {question.text}
        </p>

        <p className="text-sm text-gray-500">
          {SAVED_QUESTIONS_TEXT.correctLabel}{' '}
          <span
            className={
              isCorrect
                ? 'text-green-text font-semibold'
                : 'text-red-text font-semibold'
            }
          >
            {isCorrect
              ? CREATE_QUIZ_TEXT.question.yes
              : CREATE_QUIZ_TEXT.question.no}
          </span>
        </p>
      </div>

      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() => onRemove(question.id)}
        className="flex-shrink-0 text-xs sm:text-sm"
      >
        {SAVED_QUESTIONS_TEXT.remove}
      </Button>
    </li>
  );
}