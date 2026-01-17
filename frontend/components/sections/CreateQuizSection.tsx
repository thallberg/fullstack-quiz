'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Collapsible } from '../ui/Collapsible';
import { Switch } from '../ui/Switch';
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
  const [isPublic, setIsPublic] = useState(true);
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
        isPublic: isPublic,
        questions: savedQuestions.map((q): CreateQuestionDto => ({
          text: q.text,
          correctAnswer: q.correctAnswer,
        })),
      };

      await quizDataSource.createQuiz(createQuizDto);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid skapande av quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-indigo-border/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo to-purple text-white border-indigo-dark !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl font-bold drop-shadow-md">Skapa nytt Quiz</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300/30 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Publikt quiz
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {isPublic
                  ? 'Synligt för alla användare'
                  : 'Endast synligt för dig och dina vänner'}
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              label=""
            />
          </div>

          {savedQuestions.length > 0 && (
            <Collapsible
              title={`Sparade frågor (${savedQuestions.length})`}
              defaultOpen={true}
              className="border-indigo-300 shadow-lg"
              headerClassName="bg-gradient-to-r from-indigo to-purple text-white border-indigo-border"
              icon={
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <ul className="space-y-3">
                {savedQuestions.map((question, index) => (
                  <li
                    key={question.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-300/50 rounded-lg bg-gray-50"
                  >
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700 break-words">{question.text}</p>
                      <p className="text-sm text-gray-500">
                        Rätt svar: <span className={question.correctAnswer ? 'text-green-text font-semibold' : 'text-red-text font-semibold'}>
                          {question.correctAnswer ? 'Ja' : 'Nej'}
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSavedQuestion(question.id)}
                      className="flex-shrink-0 text-xs sm:text-sm"
                    >
                      Ta bort
                    </Button>
                  </li>
                ))}
              </ul>
            </Collapsible>
          )}

          <div className="border border-gray-300/50 rounded-lg p-3 sm:p-4 bg-gray-50">
            <Label className="mb-3 sm:mb-4 block text-base sm:text-lg font-semibold">Lägg till ny fråga</Label>
            <div className="space-y-3 sm:space-y-4">
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
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    className={cn(
                      'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all',
                      currentQuestion.correctAnswer
                        ? 'bg-green shadow-xl opacity-100 '
                        : 'bg-green-light opacity-30 cursor-pointer'
                    )}
                    onClick={() => updateCurrentQuestion('correctAnswer', true)}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all',
                      !currentQuestion.correctAnswer
                        ? 'bg-red shadow-xl opacity-100'
                        : 'bg-red-light opacity-30 cursor-pointer'
                    )}
                    onClick={() => updateCurrentQuestion('correctAnswer', false)}
                  >
                    Nej
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
            <div className="p-4 bg-gray-50 border border-red-border rounded-lg">
              <p className="text-sm text-red-text">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Avbryt
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
              Skapa Quiz
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
