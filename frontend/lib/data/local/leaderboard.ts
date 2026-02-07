import type { QuizDataSource } from '../QuizDataSource';
import type { QuizLeaderboardEntryDto, QuizResultEntryDto } from '@/types';
import {
  getCurrentUser,
  getNextId,
  isBrowser,
  loadFriendships,
  loadQuizzes,
  loadQuizResults,
  loadUsers,
  saveQuizResults,
} from './storage';

export const leaderboardHandlers: Pick<
  QuizDataSource,
  'submitQuizResult' | 'getLeaderboard'
> = {
  async submitQuizResult(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const results = loadQuizResults();
    const resultId = getNextId('quizResult');

    const result = {
      id: resultId,
      userId: currentUser.userId,
      quizId: data.quizId,
      score: data.score,
      totalQuestions: data.totalQuestions,
      percentage: data.percentage,
      completedAt: new Date().toISOString(),
    };

    results.push(result);
    saveQuizResults(results);
  },

  async getLeaderboard() {
    if (!isBrowser()) return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };

    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    }

    const allQuizzes = loadQuizzes();
    const results = loadQuizResults();
    const friendships = loadFriendships();
    const friendIds = new Set<number>();

    // Get friend IDs
    friendships.forEach(f => {
      if (f.status === 'Accepted') {
        if (f.requesterId === currentUser.userId) {
          friendIds.add(f.addresseeId);
        } else if (f.addresseeId === currentUser.userId) {
          friendIds.add(f.requesterId);
        }
      }
    });

    // Get my quizzes
    const myQuizzes = allQuizzes.filter(q => q.userId === currentUser.userId);

    // Get friends' quizzes (both public and private)
    const friendsQuizzes = allQuizzes.filter(q =>
      friendIds.has(q.userId)
    );

    // Get public quizzes NOT created by user or friends
    const myQuizIds = new Set(myQuizzes.map(q => q.id));
    const friendsQuizIds = new Set(friendsQuizzes.map(q => q.id));
    const publicQuizzes = allQuizzes.filter(q =>
      q.isPublic && !myQuizIds.has(q.id) && !friendsQuizIds.has(q.id)
    );

    // Helper to get all results for a quiz, sorted by percentage (descending)
    const getAllResultsForQuiz = (quizId: number): QuizResultEntryDto[] => {
      const quizResults = results.filter(r => r.quizId === quizId);
      const users = loadUsers();

      return quizResults
        .map(result => {
          const user = users.find(u => u.id === result.userId);
          return {
            resultId: result.id,
            userId: result.userId,
            username: user?.username || 'Okänd',
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            completedAt: result.completedAt,
          };
        })
        .sort((a, b) => {
          // Sort by percentage descending, then by completed date descending
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        });
    };

    // Build my quizzes leaderboard (top 5 per quiz)
    const myQuizzesLeaderboard: QuizLeaderboardEntryDto[] = myQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    // Build friends quizzes leaderboard (top 5 per quiz)
    const friendsQuizzesLeaderboard: QuizLeaderboardEntryDto[] = friendsQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    // Build public quizzes leaderboard (top 5 per quiz)
    const publicQuizzesLeaderboard: QuizLeaderboardEntryDto[] = publicQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    return {
      myQuizzes: myQuizzesLeaderboard,
      friendsQuizzes: friendsQuizzesLeaderboard,
      publicQuizzes: publicQuizzesLeaderboard,
    };
  },
};
