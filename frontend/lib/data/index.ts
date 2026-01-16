// THE ONE LINE SWITCH - Change USE_LOCAL_STORAGE in lib/config.ts
import { USE_LOCAL_STORAGE } from '@/lib/config';
import { apiQuizDataSource } from './ApiQuizDataSource';
import { localQuizDataSource } from './LocalQuizDataSource';

export const quizDataSource = USE_LOCAL_STORAGE
  ? localQuizDataSource
  : apiQuizDataSource;
