import type {
  LeaderboardDto,
  MyLeaderboardDto,
  SubmitQuizResultDto,
  QuizLeaderboardEntryDto,
  QuizResultEntryDto,
} from '@/api-types';
import { request } from './client';

/* ============================= */
/* ========= RAW TYPES ========= */
/* ============================= */

type RawQuizResult = {
  ResultId: number;
  UserId: number;
  Username: string;
  Score: number;
  TotalQuestions: number;
  Percentage: number;
  CompletedAt: string;
};

type RawQuizEntry = {
  QuizId: number;
  QuizTitle: string;
  Results: RawQuizResult[];
};

type RawLeaderboardResponse = {
  MyQuizzes: RawQuizEntry[];
  FriendsQuizzes: RawQuizEntry[];
  PublicQuizzes: RawQuizEntry[];
};

type RawMyLeaderboardResponse = {
  Quizzes: RawQuizEntry[];
};

/* ============================= */
/* ========= MAPPERS =========== */
/* ============================= */

function mapQuizResult(result: RawQuizResult): QuizResultEntryDto {
  return {
    resultId: result.ResultId,
    userId: result.UserId,
    username: result.Username,
    score: result.Score,
    totalQuestions: result.TotalQuestions,
    percentage: result.Percentage,
    completedAt: result.CompletedAt,
  };
}

function mapQuizEntry(entry: RawQuizEntry): QuizLeaderboardEntryDto {
  return {
    quizId: entry.QuizId,
    quizTitle: entry.QuizTitle,
    results: entry.Results.map(mapQuizResult),
  };
}

/* ============================= */
/* ========= API CALLS ========= */
/* ============================= */

export async function submitQuizResult(
  data: SubmitQuizResultDto
): Promise<void> {
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
  const response = await request<RawLeaderboardResponse>(
    '/quizresult/leaderboard'
  );

  return {
    myQuizzes: response.MyQuizzes.map(mapQuizEntry),
    friendsQuizzes: response.FriendsQuizzes.map(mapQuizEntry),
    publicQuizzes: response.PublicQuizzes.map(mapQuizEntry),
  };
}

export async function getMyLeaderboard(): Promise<MyLeaderboardDto> {
  const response = await request<RawMyLeaderboardResponse>(
    '/quizresult/my-leaderboard'
  );

  return {
    quizzes: response.Quizzes.map(mapQuizEntry),
  };
}