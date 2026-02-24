import type { QuizResultEntryDto } from '@/types';

export function sortResults(results: QuizResultEntryDto[]) {
  return [...results].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }

    return (
      new Date(b.completedAt).getTime() -
      new Date(a.completedAt).getTime()
    );
  });
}