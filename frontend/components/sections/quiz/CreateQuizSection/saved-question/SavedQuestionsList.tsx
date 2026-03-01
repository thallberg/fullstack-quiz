import { Collapsible } from '@/components/ui/Collapsible';
import { useContent } from '@/contexts/LocaleContext';
import { SavedQuestionItem } from './SavedQuestionItem';
import { QuizIcon } from './QuizIcon';
import type { SavedQuestionsListProps } from './types/savedQuestion.types';

export function SavedQuestionsList({
  questions,
  onRemove,
}: SavedQuestionsListProps) {
  const { SAVED_QUESTIONS_TEXT } = useContent();

  if (questions.length === 0) return null;

  return (
    <Collapsible
      title={SAVED_QUESTIONS_TEXT.title(questions.length)}
      defaultOpen
      className="border-indigo-300 shadow-lg"
      headerClassName="bg-gradient-to-r from-indigo to-purple text-white border-indigo-border"
      icon={<QuizIcon />}
    >
      <ul className="space-y-3">
        {questions.map((question, index) => (
          <SavedQuestionItem
            key={question.id}
            question={question}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </Collapsible>
  );
}