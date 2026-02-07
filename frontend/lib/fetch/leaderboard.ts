import type {
  LeaderboardDto,
  MyLeaderboardDto,
  SubmitQuizResultDto,
} from '@/types';
import { request } from './client';

export async function submitQuizResult(data: SubmitQuizResultDto): Promise<void> {
  const backendData = {
    QuizId: data.quizId,
    Score: data.score,
    TotalQuestions: data.totalQuestions,
    Percentage: data.percentage,
  };

  return request<void>('/quizresult', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
}

export async function getLeaderboard(): Promise<LeaderboardDto> {
  const response = await request<any>('/quizresult/leaderboard');

  // Map from backend PascalCase to frontend camelCase
  if (response && typeof response === 'object') {
    const mapResult = (result: any): any => ({
      resultId: result.ResultId ?? result.resultId,
      userId: result.UserId ?? result.userId,
      username: result.Username || result.username || '',
      score: result.Score ?? result.score ?? 0,
      totalQuestions: result.TotalQuestions ?? result.totalQuestions ?? 0,
      percentage: result.Percentage ?? result.percentage ?? 0,
      completedAt: result.CompletedAt || result.completedAt || '',
    });

    const mapEntry = (entry: any): any => ({
      quizId: entry.QuizId ?? entry.quizId,
      quizTitle: entry.QuizTitle || entry.quizTitle || '',
      results: Array.isArray(entry.Results)
        ? entry.Results.map(mapResult)
        : Array.isArray(entry.results)
        ? entry.results.map(mapResult)
        : [],
    });

    return {
      myQuizzes: Array.isArray(response.MyQuizzes)
        ? response.MyQuizzes.map(mapEntry)
        : Array.isArray(response.myQuizzes)
        ? response.myQuizzes.map(mapEntry)
        : [],
      friendsQuizzes: Array.isArray(response.FriendsQuizzes)
        ? response.FriendsQuizzes.map(mapEntry)
        : Array.isArray(response.friendsQuizzes)
        ? response.friendsQuizzes.map(mapEntry)
        : [],
      publicQuizzes: Array.isArray(response.PublicQuizzes)
        ? response.PublicQuizzes.map(mapEntry)
        : Array.isArray(response.publicQuizzes)
        ? response.publicQuizzes.map(mapEntry)
        : [],
    };
  }

  return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
}

export async function getMyLeaderboard(): Promise<MyLeaderboardDto> {
  const response = await request<any>('/quizresult/my-leaderboard');

  // Map from backend PascalCase to frontend camelCase
  if (response && typeof response === 'object') {
    const mapResult = (result: any): any => ({
      resultId: result.ResultId ?? result.resultId,
      userId: result.UserId ?? result.userId,
      username: result.Username || result.username || '',
      score: result.Score ?? result.score ?? 0,
      totalQuestions: result.TotalQuestions ?? result.totalQuestions ?? 0,
      percentage: result.Percentage ?? result.percentage ?? 0,
      completedAt: result.CompletedAt || result.completedAt || '',
    });

    const mapEntry = (entry: any): any => ({
      quizId: entry.QuizId ?? entry.quizId,
      quizTitle: entry.QuizTitle || entry.quizTitle || '',
      results: Array.isArray(entry.Results)
        ? entry.Results.map(mapResult)
        : Array.isArray(entry.results)
        ? entry.results.map(mapResult)
        : [],
    });

    return {
      quizzes: Array.isArray(response.Quizzes)
        ? response.Quizzes.map(mapEntry)
        : Array.isArray(response.quizzes)
        ? response.quizzes.map(mapEntry)
        : [],
    };
  }

  return { quizzes: [] };
}
