'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Collapsible } from '../ui/Collapsible';
import { cn } from '@/lib/utils';
import type { CreateQuestionDto } from '@/types';

interface QuestionInput {
  id: string;
  text: string;
  correctAnswer: boolean;
}

export function CreateQuizSection() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [savedQuestions, setSavedQuestions] = useState<QuestionInput[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInput>({
    id: '',
    text: '',
    correctAnswer: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError('Frågetext är obligatorisk');
      return;
    }

    const newQuestion: QuestionInput = {
      id: Date.now().toString(),
      text: currentQuestion.text.trim(),
      correctAnswer: currentQuestion.correctAnswer,
    };

    setSavedQuestions([...savedQuestions, newQuestion]);
    setCurrentQuestion({
      id: '',
      text: '',
      correctAnswer: false,
    });
    setError('');
  };

  const removeSavedQuestion = (id: string) => {
    setSavedQuestions(savedQuestions.filter((q) => q.id !== id));
  };

  const updateCurrentQuestion = (field: 'text' | 'correctAnswer', value: string | boolean) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Titel är obligatorisk');
      return;
    }

    if (savedQuestions.length === 0) {
      setError('Du måste lägga till minst en fråga');
      return;
    }

    setIsSubmitting(true);

    try {
      const createQuizDto = {
        title: title.trim(),
        description: description.trim(),
        questions: savedQuestions.map((q): CreateQuestionDto => ({
          text: q.text,
          correctAnswer: q.correctAnswer,
        })),
      };

      await apiClient.createQuiz(createQuizDto);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid skapande av quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-indigo-400 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700">
        <h2 className="text-2xl font-bold drop-shadow-md">Skapa nytt Quiz</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" required>
              Titel
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ange quiz-titel"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskrivning av quizet (valfritt)"
            />
          </div>

          {savedQuestions.length > 0 && (
            <Collapsible
              title={`Sparade frågor (${savedQuestions.length})`}
              defaultOpen={true}
              className="border-indigo-300 shadow-lg"
              headerClassName="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600"
              icon={
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <ul className="space-y-2">
                {savedQuestions.map((question, index) => (
                  <li
                    key={question.id}
                    className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  >
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question.text}</p>
                      <p className="text-sm text-gray-600">
                        Rätt svar: <span className={question.correctAnswer ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {question.correctAnswer ? 'Ja' : 'Nej'}
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSavedQuestion(question.id)}
                    >
                      Ta bort
                    </Button>
                  </li>
                ))}
              </ul>
            </Collapsible>
          )}

          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <Label className="mb-4 block text-lg font-semibold">Lägg till ny fråga</Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-question-text" required>
                  Frågetext
                </Label>
                <Input
                  id="new-question-text"
                  value={currentQuestion.text}
                  onChange={(e) => updateCurrentQuestion('text', e.target.value)}
                  placeholder="Ange frågetext"
                />
              </div>
              <div>
                <Label className="mb-2 block">Rätt svar</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={cn(
                      'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border-4',
                      currentQuestion.correctAnswer
                        ? 'bg-green-600 border-green-800 shadow-xl opacity-100 ring-2 ring-green-400'
                        : 'bg-green-400 border-green-500 opacity-30 cursor-pointer'
                    )}
                    onClick={() => updateCurrentQuestion('correctAnswer', true)}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border-4',
                      !currentQuestion.correctAnswer
                        ? 'bg-red-600 border-red-800 shadow-xl opacity-100 ring-2 ring-red-400'
                        : 'bg-red-400 border-red-500 opacity-30 cursor-pointer'
                    )}
                    onClick={() => updateCurrentQuestion('correctAnswer', false)}
                  >
                    Nej
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={saveQuestion}
                  className="flex-1"
                >
                  Spara fråga
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setCurrentQuestion({
                      id: '',
                      text: '',
                      correctAnswer: false,
                    });
                    setError('');
                  }}
                  className="flex-1"
                >
                  Rensa
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Skapar...' : 'Skapa Quiz'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
