'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import type { QuestionInput } from './types/quizTypes';
import { PublicToggle } from '../PublicToggle';
import { NewQuestionForm } from '../new-question/NewQuestionForm';
import { useContent } from '@/contexts/LocaleContext';
import { validateQuiz } from './utils/validateQuiz';
import { createEmptyQuestion } from './utils/createQuiz.utils';
import { SavedQuestionsList } from '../saved-question/SavedQuestionsList';
import { CreateQuestionDto } from '@/api-types';

export function CreateQuizForm() {
  const router = useRouter();
  const { CREATE_QUIZ_TEXT } = useContent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState<QuestionInput[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionInput>(createEmptyQuestion());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError(CREATE_QUIZ_TEXT.question.required);
      return;
    }

    const newQuestion: QuestionInput = {
      id: Date.now().toString(),
      text: currentQuestion.text.trim(),
      correctAnswer: currentQuestion.correctAnswer,
    };

    setSavedQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestion(createEmptyQuestion());
    setError('');
  };

  const removeSavedQuestion = (id: string) => {
    setSavedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateCurrentQuestion = (
    field: 'text' | 'correctAnswer',
    value: string | boolean
  ) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateQuiz(title, savedQuestions, CREATE_QUIZ_TEXT.validation);

    if (!validation.success) {
      setError(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      await quizDataSource.createQuiz({
        title: title.trim(),
        description: description.trim(),
        isPublic,
        questions: savedQuestions.map(
          (q): CreateQuestionDto => ({
            text: q.text,
            correctAnswer: q.correctAnswer,
          })
        ),
      });

      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : CREATE_QUIZ_TEXT.validation.genericError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" required>
          {CREATE_QUIZ_TEXT.form.titleLabel}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={CREATE_QUIZ_TEXT.form.titlePlaceholder}
        />
      </div>

      <div>
        <Label htmlFor="description">
          {CREATE_QUIZ_TEXT.form.descriptionLabel}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={CREATE_QUIZ_TEXT.form.descriptionPlaceholder}
        />
      </div>

      <PublicToggle
        isPublic={isPublic}
        onToggle={setIsPublic}
      />

      <SavedQuestionsList
        questions={savedQuestions}
        onRemove={removeSavedQuestion}
      />

      <NewQuestionForm
        question={currentQuestion}
        onUpdate={updateCurrentQuestion}
        onSave={saveQuestion}
        onClear={() => setCurrentQuestion(createEmptyQuestion())}
      />

      {error && (
        <div className="p-4 bg-gray-50 border border-[var(--color-red)] rounded-lg">
          <p className="text-sm text-[var(--color-red)]">
            {error}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          {CREATE_QUIZ_TEXT.form.cancel}
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {CREATE_QUIZ_TEXT.form.submit}
        </Button>
      </div>
    </form>
  );
}