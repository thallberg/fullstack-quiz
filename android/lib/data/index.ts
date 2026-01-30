// Mobilappen använder alltid API (samma som frontend när USE_LOCAL_STORAGE är false).
import { apiQuizDataSource } from './ApiQuizDataSource';

export const quizDataSource = apiQuizDataSource;
export { apiQuizDataSource };
export type { QuizDataSource } from './QuizDataSource';
