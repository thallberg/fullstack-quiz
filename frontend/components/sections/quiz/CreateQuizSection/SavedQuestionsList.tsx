import { Collapsible } from '@/components/ui/Collapsible';
import { Button } from '@/components/ui/Button';
import type { QuestionInput } from '../quizTypes';

interface SavedQuestionsListProps {
  questions: QuestionInput[];
  onRemove: (id: string) => void;
}

export function SavedQuestionsList({ questions, onRemove }: SavedQuestionsListProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <Collapsible
      title={`Sparade frågor (${questions.length})`}
      defaultOpen={true}
      className="border-indigo-300 shadow-lg"
      headerClassName="bg-gradient-to-r from-indigo to-purple text-white border-indigo-border"
      icon={
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    >
      <ul className="space-y-3">
        {questions.map((question, index) => (
          <li
            key={question.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-300/50 rounded-lg bg-gray-50"
          >
            <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700 break-words">{question.text}</p>
              <p className="text-sm text-gray-500">
                Rätt svar: <span className={question.correctAnswer ? 'text-green-text font-semibold' : 'text-red-text font-semibold'}>
                  {question.correctAnswer ? 'Ja' : 'Nej'}
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
              Ta bort
            </Button>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
