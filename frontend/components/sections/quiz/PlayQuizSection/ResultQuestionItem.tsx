"use client"

import type { QuestionResponseDto } from "@/api-types"
import { useContent } from "@/contexts/LocaleContext"

interface ResultQuestionItemProps {
  index: number
  question: QuestionResponseDto
  userAnswer: boolean | undefined
  isCorrect: boolean
}

export function ResultQuestionItem({
  index,
  question,
  userAnswer,
  isCorrect,
}: ResultQuestionItemProps) {
  const { PLAY_QUIZ_TEXT } = useContent()
  const userAnswerText = userAnswer === undefined ? PLAY_QUIZ_TEXT.result.noAnswer : userAnswer ? PLAY_QUIZ_TEXT.result.yes : PLAY_QUIZ_TEXT.result.no
  const correctAnswerText = question.correctAnswer ? PLAY_QUIZ_TEXT.result.yes : PLAY_QUIZ_TEXT.result.no

  return (
    <div
      className={`p-4 rounded-lg border ${
        isCorrect
          ? "bg-gray-50 border-[var(--color-green)]/50"
          : "bg-gray-50 border-[var(--color-red)]/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${
            isCorrect ? "bg-[var(--color-green)]" : "bg-[var(--color-red)]"
          }`}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-700 mb-3 break-words">{question.text}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ditt svar:</span>
              <span
                className={`text-sm font-semibold ${
                  userAnswer === undefined
                    ? "text-gray-500"
                    : userAnswer
                    ? "text-[var(--color-green)]"
                    : "text-[var(--color-red)]"
                }`}
              >
                {userAnswerText}
              </span>
              {!isCorrect && userAnswer !== undefined && (
                <span className="text-xs text-red-text">✗</span>
              )}
              {isCorrect && <span className="text-xs text-green-text">✓</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{PLAY_QUIZ_TEXT.result.correctAnswer}</span>
              <span
                className={`text-sm font-semibold ${
                  question.correctAnswer ? "text-[var(--color-green)]" : "text-[var(--color-red)]"
                }`}
              >
                {correctAnswerText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
