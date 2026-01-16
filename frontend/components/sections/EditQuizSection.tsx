'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Collapsible } from '../ui/Collapsible';
import { cn } from '@/lib/utils';
import type { CreateQuestionDto, QuizResponseDto } from '@/types';

interface QuestionInput {
  id: string;
  text: string;
  correctAnswer: boolean;
}

interface EditQuizSectionProps {
  quizId: number;
}

export function EditQuizSection({ quizId }: EditQuizSectionProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [savedQuestions, setSavedQuestions] = useState<QuestionInput[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInput>({
    id: '',
    text: '',
    correctAnswer: false,
  });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuestionInput>({
    id: '',
    text: '',
    correctAnswer: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      setError('');
      const quiz = await quizDataSource.getQuizById(quizId);
      setTitle(quiz.title);
      setDescription(quiz.description || '');
      setSavedQuestions(
        quiz.questions.map((q) => ({
          id: q.id?.toString() || Date.now().toString(),
          text: q.text,
          correctAnswer: q.correctAnswer,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda quiz');
    } finally {
      setIsLoading(false);
    }
  };

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

  const startEditingQuestion = (id: string) => {
    const question = savedQuestions.find((q) => q.id === id);
    if (question) {
      setEditingQuestionId(id);
      setEditingQuestion({ ...question });
    }
  };

  const cancelEditingQuestion = () => {
    setEditingQuestionId(null);
    setEditingQuestion({
      id: '',
      text: '',
      correctAnswer: false,
    });
  };

  const saveEditedQuestion = () => {
    if (!editingQuestion.text.trim()) {
      setError('Frågetext är obligatorisk');
      return;
    }

    setSavedQuestions(
      savedQuestions.map((q) =>
        q.id === editingQuestionId
          ? {
              id: q.id,
              text: editingQuestion.text.trim(),
              correctAnswer: editingQuestion.correctAnswer,
            }
          : q
      )
    );
    cancelEditingQuestion();
    setError('');
  };

  const updateEditingQuestion = (field: 'text' | 'correctAnswer', value: string | boolean) => {
    setEditingQuestion({ ...editingQuestion, [field]: value });
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
      setError('Du måste ha minst en fråga');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateQuizDto = {
        title: title.trim(),
        description: description.trim(),
        questions: savedQuestions.map((q): CreateQuestionDto => ({
          text: q.text,
          correctAnswer: q.correctAnswer,
        })),
      };

      await quizDataSource.updateQuiz(quizId, updateQuizDto);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid uppdatering av quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-indigo-400 shadow-xl">
        <CardBody>
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Laddar quiz...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-400 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700">
        <h2 className="text-2xl font-bold drop-shadow-md">Redigera Quiz</h2>
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
                  <li key={question.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
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
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => startEditingQuestion(question.id)}
                          disabled={editingQuestionId === question.id}
                        >
                          Redigera
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            if (editingQuestionId === question.id) {
                              cancelEditingQuestion();
                            }
                            removeSavedQuestion(question.id);
                          }}
                        >
                          Ta bort
                        </Button>
                      </div>
                    </div>
                    
                    {editingQuestionId === question.id && (
                      <Collapsible
                        title="Redigera fråga"
                        defaultOpen={true}
                        className="border-blue-300 shadow-lg"
                        headerClassName="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600"
                        icon={
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        }
                      >
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`edit-question-text-${question.id}`} required>
                              Frågetext
                            </Label>
                            <Input
                              id={`edit-question-text-${question.id}`}
                              value={editingQuestion.text}
                              onChange={(e) => updateEditingQuestion('text', e.target.value)}
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
                                  editingQuestion.correctAnswer
                                    ? 'bg-green-600 border-green-800 shadow-xl opacity-100 ring-2 ring-green-400'
                                    : 'bg-green-400 border-green-500 opacity-30 cursor-pointer'
                                )}
                                onClick={() => updateEditingQuestion('correctAnswer', true)}
                              >
                                Ja
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all border-4',
                                  !editingQuestion.correctAnswer
                                    ? 'bg-red-600 border-red-800 shadow-xl opacity-100 ring-2 ring-red-400'
                                    : 'bg-red-400 border-red-500 opacity-30 cursor-pointer'
                                )}
                                onClick={() => updateEditingQuestion('correctAnswer', false)}
                              >
                                Nej
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="primary"
                              onClick={saveEditedQuestion}
                              className="flex-1"
                            >
                              Spara ändringar
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={cancelEditingQuestion}
                              className="flex-1"
                            >
                              Avbryt
                            </Button>
                          </div>
                        </div>
                      </Collapsible>
                    )}
                  </li>
                ))}
              </ul>
            </Collapsible>
          )}

          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <Label className="mb-4 block text-lg font-semibold">
              Lägg till ny fråga
            </Label>
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
                  {currentQuestion.id ? 'Uppdatera fråga' : 'Spara fråga'}
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
              {isSubmitting ? 'Uppdaterar...' : 'Uppdatera Quiz'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
