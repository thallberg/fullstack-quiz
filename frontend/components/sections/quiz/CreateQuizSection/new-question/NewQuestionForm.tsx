'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { QuestionInput } from '../../quizTypes';
import { BinaryToggle } from './BinaryToggle';
import { NEW_QUESTION_TEXT } from '@/constant/sv/CreateQuiz';

interface NewQuestionFormProps {
  question: QuestionInput;
  onUpdate: (
    field: 'text' | 'correctAnswer',
    value: string | boolean
  ) => void;
  onSave: () => void;
  onClear: () => void;
}

export function NewQuestionForm({
  question,
  onUpdate,
  onSave,
  onClear,
}: NewQuestionFormProps) {
  const { title, text, answer, buttons } = NEW_QUESTION_TEXT;

  return (
    <div className="border border-gray-300/50 rounded-lg p-4 bg-gray-50">
      <Label className="mb-4 block text-lg font-semibold">
        {title}
      </Label>

      <div className="space-y-4">
        <div>
          <Label htmlFor="new-question-text" required>
            {text.label}
          </Label>

          <Input
            id="new-question-text"
            value={question.text}
            onChange={(e) =>
              onUpdate('text', e.target.value)
            }
            placeholder={text.placeholder}
          />
        </div>

        <div>
          <Label className="mb-2 block">
            {answer.label}
          </Label>

          <BinaryToggle
            value={question.correctAnswer}
            options={answer.options}
            onChange={(value) =>
              onUpdate('correctAnswer', value)
            }
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={onSave}
            className="flex-1"
          >
            {buttons.save}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            className="flex-1"
          >
            {buttons.clear}
          </Button>
        </div>
      </div>
    </div>
  );
}