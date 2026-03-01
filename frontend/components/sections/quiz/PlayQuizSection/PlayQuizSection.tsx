"use client"

import { useRouter } from "next/navigation"
import { QuizLoadingState } from "./QuizLoadingState"
import { QuizErrorState } from "./QuizErrorState"
import { QuizResultView } from "./QuizResultView"
import { QuizQuestionView } from "./QuizQuestionView"
import { usePlayQuiz } from "./hooks/usePlayQuiz"

interface PlayQuizSectionProps {
  quizId: number
}

export function PlayQuizSection({ quizId }: PlayQuizSectionProps) {
  const router = useRouter()
  const {
    quiz,
    fullQuiz,
    answers,
    results,
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    error,
    saveError,
    handleAnswer,
    resetQuiz,
  } = usePlayQuiz(quizId)

  if (isLoading) return <QuizLoadingState />

  if (error) return <QuizErrorState message={error} />

  if (!quiz || !fullQuiz) return null

  if (results !== null) {
    return (
      <QuizResultView
        quiz={quiz}
        fullQuiz={fullQuiz}
        answers={answers}
        results={results}
        saveError={saveError}
        onBack={() => router.push("/quizzes")}
        onReset={resetQuiz}
      />
    )
  }

  if (!currentQuestion) return null

  return (
    <QuizQuestionView
      quizTitle={quiz.title}
      questionText={currentQuestion.text}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onAnswer={handleAnswer}
    />
  )
}
