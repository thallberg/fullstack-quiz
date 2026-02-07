'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { quizDataSource } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import type { CreateQuestionDto } from '@/types';
import type { QuestionInput } from '../quizTypes';
import { PublicToggle } from './PublicToggle';
import { SavedQuestionsList } from './SavedQuestionsList';
import { NewQuestionForm } from './NewQuestionForm';

export function CreateQuizForm() {
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

  const handleSubmit = async (e: FormEvent) => {
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

  const clearCurrentQuestion = () => {
    setCurrentQuestion({
      id: '',
      text: '',
      correctAnswer: false,
    });
    setError('');
  };

  return (
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

      <PublicToggle isPublic={isPublic} onToggle={setIsPublic} />

      <SavedQuestionsList
        questions={savedQuestions}
        onRemove={removeSavedQuestion}
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
          Skapa Quiz
        </Button>
      </div>
    </form>
  );
}
