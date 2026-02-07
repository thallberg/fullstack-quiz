import { fetchClient } from '@/lib/fetch';
import type { QuizDataSource } from './QuizDataSource';

export const apiQuizDataSource: QuizDataSource = {
  register: (data) => fetchClient.register(data),
  login: (data) => fetchClient.login(data),
  updateProfile: (data) => fetchClient.updateProfile(data),
  changePassword: (data) => fetchClient.changePassword(data),
  getAllQuizzes: () => fetchClient.getAllQuizzes(),
  getQuizById: (id) => fetchClient.getQuizById(id),
  getMyQuizzes: () => fetchClient.getMyQuizzes(),
  createQuiz: (data) => fetchClient.createQuiz(data),
  updateQuiz: (id, data) => fetchClient.updateQuiz(id, data),
  deleteQuiz: (id) => fetchClient.deleteQuiz(id),
  playQuiz: (id) => fetchClient.playQuiz(id),
  submitQuizResult: (data) => fetchClient.submitQuizResult(data),
  getLeaderboard: () => fetchClient.getLeaderboard(),
  sendFriendInvite: (data) => fetchClient.sendFriendInvite(data),
  acceptFriendInvite: (id) => fetchClient.acceptFriendInvite(id),
  declineFriendInvite: (id) => fetchClient.declineFriendInvite(id),
  getPendingInvites: () => fetchClient.getPendingInvites(),
  getFriends: () => fetchClient.getFriends(),
  removeFriend: (id) => fetchClient.removeFriend(id),
};
