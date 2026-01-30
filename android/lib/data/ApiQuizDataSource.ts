import { apiClient } from '../api';
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
  submitQuizResult: (data) => apiClient.submitQuizResult(data),
  getLeaderboard: () => apiClient.getLeaderboard(),
  getMyLeaderboard: () => apiClient.getMyLeaderboard(),
  sendFriendInvite: (data) => apiClient.sendFriendInvite(data),
  acceptFriendInvite: (id) => apiClient.acceptFriendInvite(id),
  declineFriendInvite: (id) => apiClient.declineFriendInvite(id),
  getPendingInvites: () => apiClient.getPendingInvites(),
  getFriends: () => apiClient.getFriends(),
  removeFriend: (id) => apiClient.removeFriend(id),
};
