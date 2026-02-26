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

/* Backend returns camelCase JSON (ASP.NET Core default) */
type RawQuizResult = {
  resultId: number;
  userId: number;
  username: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
};

type RawQuizEntry = {
  quizId: number;
  quizTitle: string;
  results?: RawQuizResult[];
};

type RawLeaderboardResponse = {
  myQuizzes?: RawQuizEntry[];
  friendsQuizzes?: RawQuizEntry[];
  publicQuizzes?: RawQuizEntry[];
};

type RawMyLeaderboardResponse = {
  quizzes?: RawQuizEntry[];
};

/* ============================= */
/* ========= MAPPERS =========== */
/* ============================= */

function mapQuizResult(result: RawQuizResult): QuizResultEntryDto {
  return {
    resultId: result.resultId,
    userId: result.userId,
    username: result.username,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    completedAt: result.completedAt,
  };
}

function mapQuizEntry(entry: RawQuizEntry): QuizLeaderboardEntryDto {
  const results = entry.results ?? [];
  return {
    quizId: entry.quizId,
    quizTitle: entry.quizTitle,
    results: results.map(mapQuizResult),
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
    myQuizzes: (response.myQuizzes ?? []).map(mapQuizEntry),
    friendsQuizzes: (response.friendsQuizzes ?? []).map(mapQuizEntry),
    publicQuizzes: (response.publicQuizzes ?? []).map(mapQuizEntry),
  };
}

export async function getMyLeaderboard(): Promise<MyLeaderboardDto> {
  const response = await request<RawMyLeaderboardResponse>(
    '/quizresult/my-leaderboard'
  );

  return {
    quizzes: (response.quizzes ?? []).map(mapQuizEntry),
  };
}