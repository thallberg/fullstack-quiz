"use client"

import { ResultPieChart } from "@/components/sections/quiz/ResultPieChart"
import { useContent } from "@/contexts/LocaleContext"
import { getResultMessage } from "./utils/resultMessage"
import type { QuizResults } from "./types/playQuiz.types"

interface ResultSummaryProps {
  results: QuizResults
}

export function ResultSummary({ results }: ResultSummaryProps) {
  const { PLAY_QUIZ_TEXT } = useContent()
  const percentage = Math.round((results.correct / results.total) * 100)
  const message = getResultMessage(percentage, PLAY_QUIZ_TEXT.resultMessages)

  return (
    <div className="text-center py-4 sm:py-8">
      <div className="flex justify-center">
        <ResultPieChart correct={results.correct} total={results.total} size={240} />
      </div>

      <div className="mt-4 sm:mt-6">
        <p className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
          {results.correct}/{results.total}
        </p>
        <p className="text-lg sm:text-xl text-gray-500 mb-4">{percentage}% {PLAY_QUIZ_TEXT.result.scoreSuffix}</p>

        <div
          className={`mt-4 p-3 sm:p-4 rounded-lg border ${message.bgColor} ${message.borderColor}`}
        >
          <p className={`text-base sm:text-lg font-semibold ${message.color}`}>
            {message.text}
          </p>
        </div>
      </div>
    </div>
  )
}
