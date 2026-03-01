"use client"

import { Collapsible } from "@/components/ui/Collapsible"
import { useContent } from "@/contexts/LocaleContext"
import { ResultQuestionItem } from "./ResultQuestionItem"
import type { PlayQuizDto, QuizResponseDto } from "@/api-types"

interface ResultQuestionListProps {
  quiz: PlayQuizDto
  fullQuiz: QuizResponseDto
  answers: Record<number, boolean>
}

export function ResultQuestionList({ quiz, fullQuiz, answers }: ResultQuestionListProps) {
  const { PLAY_QUIZ_TEXT } = useContent()

  return (
    <Collapsible
      title={PLAY_QUIZ_TEXT.result.seeAllQuestions}
      className="border-[var(--color-blue)]/50 shadow-lg"
      headerClassName="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white border-[var(--color-blue)]"
      icon={
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
    >
      <div className="space-y-4 mt-4">
        {quiz.questions.map((playQuestion, index) => {
          const fullQuestion = fullQuiz.questions.find((q) => q.id === playQuestion.id)
          if (!fullQuestion) return null

          const userAnswer = answers[playQuestion.id]
          const isCorrect = userAnswer === fullQuestion.correctAnswer

          return (
            <ResultQuestionItem
              key={playQuestion.id}
              index={index}
              question={fullQuestion}
              userAnswer={userAnswer}
              isCorrect={isCorrect}
            />
          )
        })}
      </div>
    </Collapsible>
  )
}
