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
import type { QuestionInput } from '../CreateQuizSection/create-quiz/types/quizTypes';
import { PublicToggle } from '../CreateQuizSection/PublicToggle';
import { SavedQuestionsList } from './SavedQuestionsList';
import { NewQuestionForm } from './NewQuestionForm';
import { CreateQuestionDto } from '@/api-types';
import { useContent } from '@/contexts/LocaleContext';

interface EditQuizSectionProps {
  quizId: number;
}

export function EditQuizSection({ quizId }: EditQuizSectionProps) {
  const router = useRouter();
  const { EDIT_QUIZ_TEXT } = useContent();
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
      setError(err instanceof Error ? err.message : EDIT_QUIZ_TEXT.loadError);
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError(EDIT_QUIZ_TEXT.validation.questionRequired);
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
      setError(EDIT_QUIZ_TEXT.validation.questionRequired);
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
      setError(EDIT_QUIZ_TEXT.validation.titleRequired);
      return;
    }

    if (savedQuestions.length === 0) {
      setError(EDIT_QUIZ_TEXT.validation.minOneQuestion);
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
      setError(err instanceof Error ? err.message : EDIT_QUIZ_TEXT.updateError);
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
            <p className="text-gray-500">{EDIT_QUIZ_TEXT.loadingText}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-border/50 shadow-xl w-full rounded-none sm:rounded-lg">
      <CardHeader className="bg-gradient-to-r from-indigo to-purple text-white border-indigo-dark !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h2 className="text-2xl font-bold drop-shadow-md">{EDIT_QUIZ_TEXT.sectionTitle}</h2>
      </CardHeader>
      <CardBody className="p-4 sm:p-6 lg:p-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
          <div>
            <Label htmlFor="title" required>
              {EDIT_QUIZ_TEXT.titleLabel}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={EDIT_QUIZ_TEXT.titlePlaceholder}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{EDIT_QUIZ_TEXT.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={EDIT_QUIZ_TEXT.descriptionPlaceholder}
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
              {EDIT_QUIZ_TEXT.cancel}
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
              {EDIT_QUIZ_TEXT.updateButton}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
