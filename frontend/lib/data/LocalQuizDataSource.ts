import type { QuizDataSource } from './QuizDataSource';
import { authHandlers } from './local/auth';
import { friendshipHandlers } from './local/friendships';
import { leaderboardHandlers } from './local/leaderboard';
import { quizHandlers } from './local/quiz';

export const localQuizDataSource: QuizDataSource = {
  ...authHandlers,
  ...quizHandlers,
  ...friendshipHandlers,
  ...leaderboardHandlers,
};
