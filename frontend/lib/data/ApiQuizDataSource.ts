import { apiClient } from '@/lib/api';
import type { QuizDataSource } from './QuizDataSource';

export const apiQuizDataSource: QuizDataSource = {
  register: (data) => apiClient.register(data),
  login: (data) => apiClient.login(data),
  updateProfile: (data) => apiClient.updateProfile(data),
  changePassword: (data) => apiClient.changePassword(data),
  getAllQuizzes: () => apiClient.getAllQuizzes(),
  getQuizById: (id) => apiClient.getQuizById(id),
  getMyQuizzes: () => apiClient.getMyQuizzes(),
  createQuiz: (data) => apiClient.createQuiz(data),
  updateQuiz: (id, data) => apiClient.updateQuiz(id, data),
  deleteQuiz: (id) => apiClient.deleteQuiz(id),
  playQuiz: (id) => apiClient.playQuiz(id),
};
