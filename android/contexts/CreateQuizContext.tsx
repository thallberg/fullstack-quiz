import React, { createContext, useContext, useMemo, useState } from 'react';

export interface DraftQuestion {
  id: string;
  text: string;
  correctAnswer: boolean;
}

interface CreateQuizDraftContextValue {
  savedQuestions: DraftQuestion[];
  addQuestion: (question: DraftQuestion) => void;
  removeQuestion: (id: string) => void;
  clearQuestions: () => void;
}

const CreateQuizDraftContext = createContext<CreateQuizDraftContextValue | undefined>(undefined);

export function CreateQuizDraftProvider({ children }: { children: React.ReactNode }) {
  const [savedQuestions, setSavedQuestions] = useState<DraftQuestion[]>([]);

  const addQuestion = (question: DraftQuestion) => {
    setSavedQuestions((prev) => [...prev, question]);
  };

  const removeQuestion = (id: string) => {
    setSavedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const clearQuestions = () => {
    setSavedQuestions([]);
  };

  const value = useMemo(
    () => ({
      savedQuestions,
      addQuestion,
      removeQuestion,
      clearQuestions,
    }),
    [savedQuestions]
  );

  return (
    <CreateQuizDraftContext.Provider value={value}>
      {children}
    </CreateQuizDraftContext.Provider>
  );
}

export function useCreateQuizDraft() {
  const context = useContext(CreateQuizDraftContext);
  if (!context) {
    throw new Error('useCreateQuizDraft must be used within CreateQuizDraftProvider');
  }
  return context;
}
