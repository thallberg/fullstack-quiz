'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
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
      const playData = await apiClient.playQuiz(quizId);
      const fullData = await apiClient.getQuizById(quizId);
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
    setAnswers({ ...answers, [currentQuestion.id]: value });

    // Gå till nästa fråga eller avsluta
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Sista frågan besvarad, räkna resultat
      calculateResults();
    }
  };

  const calculateResults = () => {
    if (!fullQuiz) return;

    let correct = 0;
    fullQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    setResults({
      correct,
      total: fullQuiz.questions.length,
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
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">Laddar quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
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
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
        };
      } else if (percentage >= 75) {
        return {
          text: 'Utmärkt jobbat! Nästan perfekt! 🌟',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
        };
      } else if (percentage >= 50) {
        return {
          text: 'Bra jobbat! Du är på rätt väg! 👍',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
        };
      } else if (percentage >= 25) {
        return {
          text: 'Bra försök! Fortsätt öva så blir det bättre! 💪',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
        };
      } else {
        return {
          text: 'Fortsätt öva! Du kan klara det! 📚',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
        };
      }
    };

    const resultMessage = getResultMessage();

    return (
      <Card className="border-green-400 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700">
          <h2 className="text-2xl font-bold text-center drop-shadow-md">Resultat</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            <ResultPieChart correct={results.correct} total={results.total} size={280} />
  
            <div className="mt-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {results.correct}/{results.total}
              </p>
              <p className="text-xl text-gray-600 mb-4">
                {percentage}% rätt
              </p>
              
              <div className={`mt-4 p-4 rounded-lg border-2 ${resultMessage.bgColor} ${resultMessage.borderColor}`}>
                <p className={`text-lg font-semibold ${resultMessage.color}`}>
                  {resultMessage.text}
                </p>
              </div>
            </div>
  
            <div className="mt-8 flex justify-center space-x-4">
              <Button onClick={() => router.push("/")}>Tillbaka till alla quiz</Button>
              <Button variant="secondary" onClick={resetQuiz}>Spela igen</Button>
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
    <Card className="border-blue-400 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold drop-shadow-md">{quiz.title}</h2>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-semibold">
            Fråga {questionNumber} av {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-8">
          <div className="text-center py-8">
            <Label className="text-2xl font-semibold text-gray-900 mb-8 block">
              {currentQuestion.text}
            </Label>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 text-white border-2 border-green-700 hover:border-green-800 shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-lg transition-all"
              onClick={() => handleAnswer(true)}
            >
              Ja
            </button>
            <button
              type="button"
              className="flex-1 max-w-xs bg-red-600 hover:bg-red-800 text-white border-2 border-red-700 hover:border-red-900 shadow-lg hover:shadow-xl font-bold rounded-lg py-3 px-6 text-lg transition-all"
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
