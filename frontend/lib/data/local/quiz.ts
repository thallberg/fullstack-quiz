import type { QuizDataSource } from '../QuizDataSource';
import {
  getCurrentUser,
  getNextId,
  isBrowser,
  loadFriendships,
  loadQuizzes,
  saveQuizzes,
} from './storage';

export const quizHandlers: Pick<
  QuizDataSource,
  'getAllQuizzes' | 'getQuizById' | 'getMyQuizzes' | 'createQuiz' | 'updateQuiz' | 'deleteQuiz' | 'playQuiz'
> = {
  async getAllQuizzes() {
    if (!isBrowser()) return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };

    const currentUser = getCurrentUser();
    if (!currentUser) {
      // If not authenticated, only return public quizzes
      const allQuizzes = loadQuizzes();
      return {
        myQuizzes: [],
        friendsQuizzes: [],
        publicQuizzes: allQuizzes.filter(q => q.isPublic !== false), // Default to public if not set
      };
    }

    const allQuizzes = loadQuizzes();
    const friends = loadFriendships();
    const friendIds = new Set<number>();

    // Get friend IDs
    friends.forEach(f => {
      if (f.status === 'Accepted') {
        if (f.requesterId === currentUser.userId) {
          friendIds.add(f.addresseeId);
        } else if (f.addresseeId === currentUser.userId) {
          friendIds.add(f.requesterId);
        }
      }
    });

    // Group quizzes
    const myQuizzes = allQuizzes.filter(q => q.userId === currentUser.userId);
    const friendsQuizzes = allQuizzes.filter(q =>
      q.isPublic === false && friendIds.has(q.userId)
    );
    const publicQuizzes = allQuizzes.filter(q =>
      q.isPublic !== false && q.userId !== currentUser.userId && !friendIds.has(q.userId)
    );

    return {
      myQuizzes,
      friendsQuizzes,
      publicQuizzes,
    };
  },

  async getQuizById(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = loadQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  },

  async getMyQuizzes() {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const quizzes = loadQuizzes();
    return quizzes.filter(q => q.userId === currentUser.userId);
  },

  async createQuiz(data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizId = getNextId('quiz');
    const quiz = {
      id: quizId,
      title: data.title,
      description: data.description,
      isPublic: data.isPublic ?? true,
      createdAt: new Date().toISOString(),
      userId: currentUser.userId,
      username: currentUser.username,
      questions: data.questions.map((q) => ({
        id: getNextId('question'),
        text: q.text,
        correctAnswer: q.correctAnswer,
      })),
    };

    const quizzes = loadQuizzes();
    quizzes.push(quiz);
    saveQuizzes(quizzes);

    return quiz;
  },

  async updateQuiz(id, data) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = loadQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    if (quizzes[quizIndex].userId !== currentUser.userId) {
      throw new Error('Unauthorized');
    }

    quizzes[quizIndex].title = data.title;
    quizzes[quizIndex].description = data.description;
    quizzes[quizIndex].isPublic = data.isPublic ?? true;
    // Create new questions with new IDs (matching backend behavior)
    quizzes[quizIndex].questions = data.questions.map((q) => ({
      id: getNextId('question'),
      text: q.text,
      correctAnswer: q.correctAnswer,
    }));

    saveQuizzes(quizzes);
    return quizzes[quizIndex];
  },

  async deleteQuiz(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = loadQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    if (quizzes[quizIndex].userId !== currentUser.userId) {
      throw new Error('Unauthorized');
    }

    quizzes.splice(quizIndex, 1);
    saveQuizzes(quizzes);
  },

  async playQuiz(id) {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = loadQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
      })),
    };
  },
};
