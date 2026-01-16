'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';
import type { PlayQuizDto, QuizResponseDto } from '@/types';
import { ResultPieChart } from './ResultPieChart';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      // Initialize answers
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
    // Update answers immediately with the current question's ID
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Gå till nästa fråga eller avsluta
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Sista frågan besvarad, räkna resultat med uppdaterade svar direkt
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = (answersToUse?: Record<number, boolean>) => {
    if (!fullQuiz || !quiz) return;

    // Use provided answers or fall back to state
    const answersToCheck = answersToUse || answers;

    let correct = 0;
    let total = 0;
    
    // Match answers with questions - use the same order as playQuiz
    quiz.questions.forEach((playQuestion) => {
      const fullQuestion = fullQuiz.questions.find(q => q.id === playQuestion.id);
      if (fullQuestion) {
        total++;
        const userAnswer = answersToCheck[playQuestion.id];
        // Check if answer exists and matches correct answer
        if (userAnswer !== undefined && userAnswer === fullQuestion.correctAnswer) {
          correct++;
        }
      }
    });

    setResults({
      correct,
      total: total || quiz.questions.length,
    });
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
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-blue" />
        <p className="text-gray-500">Laddar quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 border border-red-border rounded-lg">
        <p className="text-red-text">{error}</p>
      </div>
    );
  }

  if (!quiz || !fullQuiz) {
    return null;
  }


  
  if (results !== null) {
    const percentage = Math.round((results.correct / results.total) * 100);
    
    const getResultMessage = () => {
      if (percentage === 100) {
        return {
          text: 'Perfekt! Du fick alla rätt! 🎉',
          color: 'text-green-text',
          bgColor: 'bg-gray-50',
          borderColor: 'border-green-border/50',
        };
      } else if (percentage >= 75) {
        return {
          text: 'Utmärkt jobbat! Nästan perfekt! 🌟',
          color: 'text-green-text',
          bgColor: 'bg-gray-50',
          borderColor: 'border-green-border/50',
        };
      } else if (percentage >= 50) {
        return {
          text: 'Bra jobbat! Du är på rätt väg! 👍',
          color: 'text-blue-text',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-border/50',
        };
      } else if (percentage >= 25) {
        return {
          text: 'Bra försök! Fortsätt öva så blir det bättre! 💪',
          color: 'text-yellow-text',
          bgColor: 'bg-gray-50',
          borderColor: 'border-yellow-border/50',
        };
      } else {
        return {
          text: 'Fortsätt öva! Du kan klara det! 📚',
          color: 'text-orange-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-orange-border/50',
        };
      }
    };

    const resultMessage = getResultMessage();

    return (
      <Card className="border-green-border shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green to-emerald text-white border-green-dark">
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
  
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button onClick={() => router.push("/")} className="w-full sm:w-auto">Tillbaka till alla quiz</Button>
              <Button variant="secondary" onClick={resetQuiz} className="w-full sm:w-auto">Spela igen</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  // Visa aktuell fråga
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = quiz.questions.length;

  return (
    <Card className="border-blue-border/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue to-indigo text-white border-blue-dark">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold drop-shadow-md break-words">{quiz.title}</h2>
          <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            Fråga {questionNumber} av {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center py-4 sm:py-8">
            <Label className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-8 block break-words">
              {currentQuestion.text}
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              type="button"
              className="flex-1 sm:max-w-xs bg-green hover:bg-green-dark text-white border border-green-dark/50 hover:border-green-dark/70 shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-base sm:text-lg transition-all"
              onClick={() => handleAnswer(true)}
            >
              Ja
            </button>
            <button
              type="button"
              className="flex-1 sm:max-w-xs bg-red hover:bg-red-dark text-white border border-red-dark/50 hover:border-red-dark/70 shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-base sm:text-lg transition-all"
              onClick={() => handleAnswer(false)}
            >
              Nej
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
