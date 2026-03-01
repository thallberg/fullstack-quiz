"use client"

import { useEffect, useState, useCallback } from "react"
import { quizDataSource } from "@/lib/data"
import type { PlayQuizDto, QuizResponseDto } from "@/api-types"
import type { QuizResults } from "../types/playQuiz.types"
import { useContent } from "@/contexts/LocaleContext"

export function usePlayQuiz(quizId: number) {
  const { PLAY_QUIZ_TEXT } = useContent()
  const [quiz, setQuiz] = useState<PlayQuizDto | null>(null)
  const [fullQuiz, setFullQuiz] = useState<QuizResponseDto | null>(null)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<QuizResults | null>(null)
  const [error, setError] = useState("")
  const [saveError, setSaveError] = useState("")

  const loadQuiz = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const playData = await quizDataSource.playQuiz(quizId)
      const fullData = await quizDataSource.getQuizById(quizId)
      setQuiz(playData)
      setFullQuiz(fullData)
      const initialAnswers: Record<number, boolean> = {}
      playData.questions.forEach((q) => {
        initialAnswers[q.id] = false
      })
      setAnswers(initialAnswers)
      setCurrentQuestionIndex(0)
      setResults(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : PLAY_QUIZ_TEXT.loadError
      )
    } finally {
      setIsLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    loadQuiz()
  }, [loadQuiz])

  const handleAnswer = useCallback(
    (value: boolean) => {
      if (!quiz) return

      const currentQuestion = quiz.questions[currentQuestionIndex]
      const updatedAnswers = { ...answers, [currentQuestion.id]: value }
      setAnswers(updatedAnswers)

      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((i) => i + 1)
      } else {
        calculateAndSubmitResults(updatedAnswers)
      }
    },
    [quiz, currentQuestionIndex, answers]
  )

  const calculateAndSubmitResults = useCallback(
    async (answersToUse?: Record<number, boolean>) => {
      if (!fullQuiz || !quiz) return

      const answersToCheck = answersToUse ?? answers

      let correct = 0
      let total = 0

      quiz.questions.forEach((playQuestion) => {
        const fullQuestion = fullQuiz.questions.find((q) => q.id === playQuestion.id)
        if (fullQuestion) {
          total++
          const userAnswer = answersToCheck[playQuestion.id]
          if (userAnswer !== undefined && userAnswer === fullQuestion.correctAnswer) {
            correct++
          }
        }
      })

      const finalTotal = total || quiz.questions.length
      const percentage = Math.round((correct / finalTotal) * 100)

      setResults({ correct, total: finalTotal })

      try {
        if (!quiz.id) return

        await quizDataSource.submitQuizResult({
          quizId: quiz.id,
          score: correct,
          totalQuestions: finalTotal,
          percentage,
        })
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : ""
        setSaveError(
          errMessage.includes("Invalid user") || errMessage.includes("401")
            ? PLAY_QUIZ_TEXT.saveError.loginAgain
            : errMessage.includes("Failed to fetch") || errMessage.includes("CORS")
            ? PLAY_QUIZ_TEXT.saveError.serverError
            : PLAY_QUIZ_TEXT.saveError.generic(errMessage)
        )
      }
    },
    [quiz, fullQuiz, answers]
  )

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0)
    setResults(null)
    setSaveError("")
    const initialAnswers: Record<number, boolean> = {}
    quiz?.questions.forEach((q) => {
      initialAnswers[q.id] = false
    })
    setAnswers(initialAnswers)
  }, [quiz])

  const currentQuestion = quiz?.questions[currentQuestionIndex] ?? null
  const questionNumber = currentQuestionIndex + 1
  const totalQuestions = quiz?.questions.length ?? 0

  return {
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
    loadQuiz,
  }
}
