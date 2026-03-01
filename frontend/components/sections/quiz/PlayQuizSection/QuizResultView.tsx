"use client"

import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useContent } from "@/contexts/LocaleContext"
import { ResultSummary } from "./ResultSummary"
import { ResultQuestionList } from "./ResultQuestionList"
import type { PlayQuizDto, QuizResponseDto } from "@/api-types"
import type { QuizResults } from "./types/playQuiz.types"

interface QuizResultViewProps {
  quiz: PlayQuizDto
  fullQuiz: QuizResponseDto
  answers: Record<number, boolean>
  results: QuizResults
  saveError?: string
  onBack: () => void
  onReset: () => void
}

export function QuizResultView({
  quiz,
  fullQuiz,
  answers,
  results,
  saveError,
  onBack,
  onReset,
}: QuizResultViewProps) {
  const { PLAY_QUIZ_TEXT } = useContent()

  return (
    <Card className="border-[var(--color-green)] shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center drop-shadow-md">
          {PLAY_QUIZ_TEXT.result.title}
        </h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        {saveError && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--color-yellow)]/20 border border-[var(--color-yellow)]/50 text-sm text-gray-700">
            ⚠️ {saveError}
          </div>
        )}

        <ResultSummary results={results} />

        <div className="mt-4 sm:mt-6">
          <ResultQuestionList quiz={quiz} fullQuiz={fullQuiz} answers={answers} />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button onClick={onBack} className="w-full sm:w-auto">
            {PLAY_QUIZ_TEXT.result.backToQuizzes}
          </Button>
          <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto">
            {PLAY_QUIZ_TEXT.result.playAgain}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
