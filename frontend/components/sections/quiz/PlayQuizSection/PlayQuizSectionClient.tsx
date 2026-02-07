'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import type { PlayQuizDto, QuizResponseDto } from '@/types';
import { QuizLoadingState } from './QuizLoadingState';
import { QuizErrorState } from './QuizErrorState';
import { QuizResultView } from './QuizResultView';
import { QuizQuestionView } from './QuizQuestionView';

interface PlayQuizSectionProps {
  quizId: number;
}

export function PlayQuizSection({ quizId }: PlayQuizSectionProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<PlayQuizDto | null>(null);
  const [fullQuiz, setFullQuiz] = useState<QuizResponseDto | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const playData = await quizDataSource.playQuiz(quizId);
      const fullData = await quizDataSource.getQuizById(quizId);
      setQuiz(playData);
      setFullQuiz(fullData);
      const initialAnswers: Record<number, boolean> = {};
      playData.questions.forEach((q) => {
        initialAnswers[q.id] = false;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value: boolean) => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = async (answersToUse?: Record<number, boolean>) => {
    if (!fullQuiz || !quiz) return;

    const answersToCheck = answersToUse || answers;

    let correct = 0;
    let total = 0;

    quiz.questions.forEach((playQuestion) => {
      const fullQuestion = fullQuiz.questions.find(q => q.id === playQuestion.id);
      if (fullQuestion) {
        total++;
        const userAnswer = answersToCheck[playQuestion.id];
        if (userAnswer !== undefined && userAnswer === fullQuestion.correctAnswer) {
          correct++;
        }
      }
    });

    const finalTotal = total || quiz.questions.length;
    const percentage = Math.round((correct / finalTotal) * 100);

    setResults({
      correct,
      total: finalTotal,
    });

    try {
      if (!quiz || !quiz.id) {
        console.error('Cannot submit result: quiz or quiz.id is missing', { quiz, quizId });
        return;
      }

      await quizDataSource.submitQuizResult({
        quizId: quiz.id,
        score: correct,
        totalQuestions: finalTotal,
        percentage: percentage,
      });
    } catch (err) {
      console.error('Failed to submit quiz result:', err);
      if (err instanceof Error) {
        console.error('Error details:', err.message);
      }
      if (err instanceof Error) {
        if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
          console.warn('CORS error or network issue - result may not be saved. Check Azure CORS settings.');
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          console.warn('API endpoint not found - check if QuizResults migration has been run in Azure database.');
        }
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setResults(null);
    const initialAnswers: Record<number, boolean> = {};
    if (quiz) {
      quiz.questions.forEach((q) => {
        initialAnswers[q.id] = false;
      });
    }
    setAnswers(initialAnswers);
  };

  if (isLoading) {
    return <QuizLoadingState />;
  }

  if (error) {
    return <QuizErrorState message={error} />;
  }

  if (!quiz || !fullQuiz) {
    return null;
  }

  if (results !== null) {
    return (
      <QuizResultView
        quiz={quiz}
        fullQuiz={fullQuiz}
        answers={answers}
        results={results}
        onBack={() => router.push('/quizzes')}
        onReset={resetQuiz}
      />
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = quiz.questions.length;

  return (
    <QuizQuestionView
      quizTitle={quiz.title}
      questionText={currentQuestion.text}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onAnswer={handleAnswer}
    />
  );
}
