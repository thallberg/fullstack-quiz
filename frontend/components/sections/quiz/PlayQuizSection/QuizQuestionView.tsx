import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';

interface QuizQuestionViewProps {
  quizTitle: string;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (value: boolean) => void;
}

export function QuizQuestionView({
  quizTitle,
  questionText,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionViewProps) {
  return (
    <Card className="border-[var(--color-blue)]/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold drop-shadow-md break-words">{quizTitle}</h2>
          <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            Fråga {questionNumber} av {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center py-4 sm:py-8">
            <Label className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-8 block break-words">
              {questionText}
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              type="button"
              className="flex-1 sm:max-w-xs bg-[var(--color-green)] hover:bg-[var(--color-green)] text-white border border-[var(--color-green)]/70 hover:border-[var(--color-green)] shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-base sm:text-lg transition-all"
              onClick={() => onAnswer(true)}
            >
              Ja
            </button>
            <button
              type="button"
              className="flex-1 sm:max-w-xs bg-[var(--color-red)] hover:bg-[var(--color-red)] text-white border border-[var(--color-red)]/70 hover:border-[var(--color-red)] shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-base sm:text-lg transition-all"
              onClick={() => onAnswer(false)}
            >
              Nej
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
