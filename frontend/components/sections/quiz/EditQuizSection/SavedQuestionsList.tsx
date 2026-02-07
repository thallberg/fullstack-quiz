import { Collapsible } from '@/components/ui/Collapsible';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import type { QuestionInput } from '../quizTypes';

interface SavedQuestionsListProps {
  questions: QuestionInput[];
  editingQuestionId: string | null;
  editingQuestion: QuestionInput;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRemove: (id: string) => void;
  onUpdateEditingQuestion: (field: 'text' | 'correctAnswer', value: string | boolean) => void;
}

export function SavedQuestionsList({
  questions,
  editingQuestionId,
  editingQuestion,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  onUpdateEditingQuestion,
}: SavedQuestionsListProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <Collapsible
      title={`Sparade frågor (${questions.length})`}
      defaultOpen={true}
      className="border-indigo-300 shadow-lg w-full rounded-none sm:rounded-lg"
      headerClassName="bg-gradient-to-r from-indigo to-purple text-white border-indigo-border text-lg sm:text-xl py-4 sm:py-5 px-4 sm:px-6"
      icon={
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    >
      <ul className="space-y-5 w-full">
        {questions.map((question, index) => (
          <li key={question.id} className="space-y-3 w-full">
            <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8 border border-gray-300/50 rounded-lg bg-gray-50 w-full">
              <div className="flex items-start gap-5">
                <span className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg sm:text-xl font-medium text-gray-700 break-words mb-2">{question.text}</p>
                  <p className="text-base sm:text-lg text-gray-500">
                    Rätt svar: <span className={question.correctAnswer ? 'text-green-text font-semibold' : 'text-red-text font-semibold'}>
                      {question.correctAnswer ? 'Ja' : 'Nej'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onStartEdit(question.id)}
                  disabled={editingQuestionId === question.id}
                  className="text-base w-full sm:w-auto py-3 px-6"
                >
                  Redigera
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (editingQuestionId === question.id) {
                      onCancelEdit();
                    }
                    onRemove(question.id);
                  }}
                  className="text-base w-full sm:w-auto py-3 px-6"
                >
                  Ta bort
                </Button>
              </div>
            </div>

            {editingQuestionId === question.id && (
              <Collapsible
                title="Redigera fråga"
                defaultOpen={true}
                className="border-[var(--color-blue)]/40 shadow-lg"
                headerClassName="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-cyan)] text-white border-[var(--color-blue)]"
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor={`edit-question-text-${question.id}`} required>
                      Frågetext
                    </Label>
                    <Input
                      id={`edit-question-text-${question.id}`}
                      value={editingQuestion.text}
                      onChange={(e) => onUpdateEditingQuestion('text', e.target.value)}
                      placeholder="Ange frågetext"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Rätt svar</Label>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        type="button"
                        className={cn(
                          'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border border-[var(--color-green)]/50',
                          editingQuestion.correctAnswer
                            ? 'bg-[var(--color-green)] shadow-xl opacity-100 ring-1 ring-[var(--color-green)]/50'
                            : 'bg-gray-50 border-[var(--color-green)] opacity-30 cursor-pointer'
                        )}
                        onClick={() => onUpdateEditingQuestion('correctAnswer', true)}
                      >
                        Ja
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border border-[var(--color-red)]/50',
                          !editingQuestion.correctAnswer
                            ? 'bg-[var(--color-red)] shadow-xl opacity-100 ring-1 ring-[var(--color-red)]/50'
                            : 'bg-gray-50 border-[var(--color-red)] opacity-30 cursor-pointer'
                        )}
                        onClick={() => onUpdateEditingQuestion('correctAnswer', false)}
                      >
                        Nej
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={onSaveEdit}
                      className="flex-1"
                    >
                      Spara ändringar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onCancelEdit}
                      className="flex-1"
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              </Collapsible>
            )}
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
