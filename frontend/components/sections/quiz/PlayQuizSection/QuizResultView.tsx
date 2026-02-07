import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Collapsible } from '@/components/ui/Collapsible';
import { ResultPieChart } from '@/components/sections/quiz/ResultPieChart';
import type { PlayQuizDto, QuizResponseDto } from '@/types';

interface QuizResultViewProps {
  quiz: PlayQuizDto;
  fullQuiz: QuizResponseDto;
  answers: Record<number, boolean>;
  results: { correct: number; total: number };
  onBack: () => void;
  onReset: () => void;
}

export function QuizResultView({
  quiz,
  fullQuiz,
  answers,
  results,
  onBack,
  onReset,
}: QuizResultViewProps) {
  const percentage = Math.round((results.correct / results.total) * 100);

  const getResultMessage = () => {
    if (percentage === 100) {
      return {
        text: 'Perfekt! Du fick alla rätt! 🎉',
        color: 'text-[var(--color-green)]',
        bgColor: 'bg-gray-50',
        borderColor: 'border-[var(--color-green)]/50',
      };
    } else if (percentage >= 75) {
      return {
        text: 'Utmärkt jobbat! Nästan perfekt! 🌟',
        color: 'text-green-text',
        bgColor: 'bg-gray-50',
        borderColor: 'border-[var(--color-green)]/50',
      };
    } else if (percentage >= 50) {
      return {
        text: 'Bra jobbat! Du är på rätt väg! 👍',
        color: 'text-[var(--color-blue)]',
        bgColor: 'bg-[var(--color-blue)]/10',
        borderColor: 'border-[var(--color-blue)]/50',
      };
    } else if (percentage >= 25) {
      return {
        text: 'Bra försök! Fortsätt öva så blir det bättre! 💪',
        color: 'text-[var(--color-yellow)]',
        bgColor: 'bg-gray-50',
        borderColor: 'border-[var(--color-yellow)]/50',
      };
    } else {
      return {
        text: 'Fortsätt öva! Du kan klara det! 📚',
        color: 'text-[var(--color-orange)]',
        bgColor: 'bg-gray-50',
        borderColor: 'border-[var(--color-orange)]/50',
      };
    }
  };

  const resultMessage = getResultMessage();

  return (
    <Card className="border-[var(--color-green)] shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center drop-shadow-md">Resultat</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <div className="text-center py-4 sm:py-8">
          <div className="flex justify-center">
            <ResultPieChart correct={results.correct} total={results.total} size={240} />
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
              {results.correct}/{results.total}
            </p>
            <p className="text-lg sm:text-xl text-gray-500 mb-4">
              {percentage}% rätt
            </p>

            <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${resultMessage.bgColor} ${resultMessage.borderColor}`}>
              <p className={`text-base sm:text-lg font-semibold ${resultMessage.color}`}>
                {resultMessage.text}
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <Collapsible
              title="Se alla frågor och svar"
              className="border-[var(--color-blue)]/50 shadow-lg"
              headerClassName="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)]"
              icon={
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <div className="space-y-4 mt-4">
                {quiz.questions.map((playQuestion, index) => {
                  const fullQuestion = fullQuiz.questions.find(q => q.id === playQuestion.id);
                  if (!fullQuestion) return null;

                  const userAnswer = answers[playQuestion.id];
                  const isCorrect = userAnswer === fullQuestion.correctAnswer;
                  const userAnswerText = userAnswer === undefined ? 'Inget svar' : (userAnswer ? 'Ja' : 'Nej');
                  const correctAnswerText = fullQuestion.correctAnswer ? 'Ja' : 'Nej';

                  return (
                    <div
                      key={playQuestion.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? 'bg-gray-50 border-[var(--color-green)]/50'
                          : 'bg-gray-50 border-[var(--color-red)]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${
                          isCorrect ? 'bg-[var(--color-green)]' : 'bg-[var(--color-red)]'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-700 mb-3 break-words">
                            {fullQuestion.text}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Ditt svar:</span>
                              <span className={`text-sm font-semibold ${
                                userAnswer === undefined
                                  ? 'text-gray-500'
                                  : userAnswer
                                  ? 'text-[var(--color-green)]'
                                  : 'text-[var(--color-red)]'
                              }`}>
                                {userAnswerText}
                              </span>
                              {!isCorrect && userAnswer !== undefined && (
                                <span className="text-xs text-red-text">✗</span>
                              )}
                              {isCorrect && (
                                <span className="text-xs text-green-text">✓</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Rätt svar:</span>
                              <span className={`text-sm font-semibold ${
                                fullQuestion.correctAnswer ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
                              }`}>
                                {correctAnswerText}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Collapsible>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button onClick={onBack} className="w-full sm:w-auto">Tillbaka till alla quiz</Button>
            <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto">Spela igen</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
