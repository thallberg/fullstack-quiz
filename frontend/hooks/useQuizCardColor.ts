import { useCallback } from 'react';

const CARD_COLORS = [
  'border-[var(--color-blue)]',
  'border-[var(--color-purple)]',
  'border-[var(--color-pink)]',
  'border-[var(--color-green)]',
  'border-[var(--color-yellow)]',
];

export const useQuizCardColor = () => {
  return useCallback((quizId: number) => {
    const index = Math.abs(quizId) % CARD_COLORS.length;
    return CARD_COLORS[index];
  }, []);
};
