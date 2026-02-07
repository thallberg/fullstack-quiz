'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { CreateQuestionDto } from '@/types';
import type { QuestionInput } from '../quizTypes';
import { PublicToggle } from '../CreateQuizSection/PublicToggle';
import { SavedQuestionsList } from './SavedQuestionsList';
import { NewQuestionForm } from './NewQuestionForm';

interface EditQuizSectionProps {
  quizId: number;
}

export function EditQuizSection({ quizId }: EditQuizSectionProps) {
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
      setIsPublic(quiz.isPublic ?? true);
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

  const handleSubmit = async (e: FormEvent) => {
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
        isPublic: isPublic,
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

  const clearCurrentQuestion = () => {
    setCurrentQuestion({
      id: '',
      text: '',
      correctAnswer: false,
    });
    setError('');
  };

  if (isLoading) {
    return (
      <Card className="border-indigo-border shadow-xl">
        <CardBody>
          <div className="flex flex-col justify-center items-center py-12 gap-4">
            <Spinner size="lg" className="border-indigo" />
            <p className="text-gray-500">Laddar quiz...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-border/50 shadow-xl w-full rounded-none sm:rounded-lg">
      <CardHeader className="bg-gradient-to-r from-indigo to-purple text-white border-indigo-dark !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl font-bold drop-shadow-md">Redigera Quiz</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6 lg:p-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
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

          <PublicToggle isPublic={isPublic} onToggle={setIsPublic} />

          <SavedQuestionsList
            questions={savedQuestions}
            editingQuestionId={editingQuestionId}
            editingQuestion={editingQuestion}
            onStartEdit={startEditingQuestion}
            onCancelEdit={cancelEditingQuestion}
            onSaveEdit={saveEditedQuestion}
            onRemove={removeSavedQuestion}
            onUpdateEditingQuestion={updateEditingQuestion}
          />

          <NewQuestionForm
            question={currentQuestion}
            onUpdate={updateCurrentQuestion}
            onSave={saveQuestion}
            onClear={clearCurrentQuestion}
          />

          {error && (
            <div className="p-4 bg-gray-50 border border-[var(--color-red)] rounded-lg">
              <p className="text-sm text-[var(--color-red)]">{error}</p>
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
              Uppdatera Quiz
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
