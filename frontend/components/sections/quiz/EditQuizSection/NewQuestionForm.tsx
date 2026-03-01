import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import type { QuestionInput } from '../CreateQuizSection/create-quiz/types/quizTypes';
import { useContent } from '@/contexts/LocaleContext';

interface NewQuestionFormProps {
  question: QuestionInput;
  onUpdate: (field: 'text' | 'correctAnswer', value: string | boolean) => void;
  onSave: () => void;
  onClear: () => void;
}

export function NewQuestionForm({
  question,
  onUpdate,
  onSave,
  onClear,
}: NewQuestionFormProps) {
  const { EDIT_QUIZ_TEXT } = useContent();

  return (
    <div className="border border-gray-300/50 rounded-lg p-3 sm:p-4 bg-gray-50">
      <Label className="mb-3 sm:mb-4 block text-base sm:text-lg font-semibold">
        {EDIT_QUIZ_TEXT.questionForm.addTitle}
      </Label>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="new-question-text" required>
            {EDIT_QUIZ_TEXT.questionForm.textLabel}
          </Label>
          <Input
            id="new-question-text"
            value={question.text}
            onChange={(e) => onUpdate('text', e.target.value)}
            placeholder={EDIT_QUIZ_TEXT.questionForm.textPlaceholder}
          />
        </div>
        <div>
          <Label className="mb-2 block">{EDIT_QUIZ_TEXT.questionForm.correctAnswerLabel}</Label>
          <div className="flex gap-3">
            <button
              type="button"
              className={cn(
                'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border border-[var(--color-green)]/50',
                question.correctAnswer
                  ? 'bg-[var(--color-green)] shadow-xl opacity-100 ring-1 ring-[var(--color-green)]/50'
                  : 'bg-gray-50 border-[var(--color-green)] opacity-30 cursor-pointer'
              )}
              onClick={() => onUpdate('correctAnswer', true)}
            >
              {EDIT_QUIZ_TEXT.questionForm.yes}
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border border-[var(--color-red)]/50',
                !question.correctAnswer
                  ? 'bg-[var(--color-red)] shadow-xl opacity-100 ring-1 ring-[var(--color-red)]/50'
                  : 'bg-gray-50 border-[var(--color-red)] opacity-30 cursor-pointer'
              )}
              onClick={() => onUpdate('correctAnswer', false)}
            >
              {EDIT_QUIZ_TEXT.questionForm.no}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={onSave}
            className="flex-1"
          >
            {question.id ? EDIT_QUIZ_TEXT.questionForm.updateQuestion : EDIT_QUIZ_TEXT.questionForm.saveQuestion}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            className="flex-1"
          >
            {EDIT_QUIZ_TEXT.questionForm.clear}
          </Button>
        </div>
      </div>
    </div>
  );
}
