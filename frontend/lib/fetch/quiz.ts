import type {
  CreateQuizDto,
  QuizResponseDto,
  GroupedQuizzesDto,
  PlayQuizDto,
  QuestionResponseDto,
} from '@/api-types';
import { request } from './client';

/* ============================= */
/* ========= RAW TYPES ========= */
/* ============================= */

/* Backend returns camelCase JSON (ASP.NET Core default) */
type RawQuestion = {
  id: number;
  text: string;
  correctAnswer: boolean;
};

type RawQuiz = {
  id: number;
  title: string;
  description: string;
  userId: number;
  username: string;
  createdAt: string;
  isPublic: boolean;
  questions?: RawQuestion[];
};

type RawGroupedQuizzes = {
  myQuizzes?: RawQuiz[];
  friendsQuizzes?: RawQuiz[];
  publicQuizzes?: RawQuiz[];
};

/* ============================= */
/* ========= MAPPERS =========== */
/* ============================= */

function mapQuestion(question: RawQuestion): QuestionResponseDto {
  return {
    id: question.id,
    text: question.text,
    correctAnswer: question.correctAnswer,
  };
}

function mapQuiz(quiz: RawQuiz): QuizResponseDto {
  const questions = quiz.questions ?? [];
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    userId: quiz.userId,
    username: quiz.username,
    createdAt: quiz.createdAt,
    isPublic: quiz.isPublic,
    questions: questions.map(mapQuestion),
  };
}

/* ============================= */
/* ========= API CALLS ========= */
/* ============================= */

export async function getAllQuizzes(): Promise<GroupedQuizzesDto> {
  try {
    const response = await request<RawGroupedQuizzes>('/quiz');

    return {
      myQuizzes: (response.myQuizzes ?? []).map(mapQuiz),
      friendsQuizzes: (response.friendsQuizzes ?? []).map(mapQuiz),
      publicQuizzes: (response.publicQuizzes ?? []).map(mapQuiz),
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes('401')) {
      return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    }
    throw err;
  }
}

export async function getQuizById(id: number): Promise<QuizResponseDto> {
  const response = await request<RawQuiz>(`/quiz/${id}`);
  return mapQuiz(response);
}

export async function createQuiz(
  data: CreateQuizDto
): Promise<QuizResponseDto> {
  const backendData = {
    title: data.title,
    description: data.description,
    isPublic: data.isPublic,
    questions: data.questions.map((q) => ({
      text: q.text,
      correctAnswer: q.correctAnswer,
    })),
  };

  const response = await request<RawQuiz>('/quiz', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });

  return mapQuiz(response);
}

export async function updateQuiz(
  id: number,
  data: CreateQuizDto
): Promise<QuizResponseDto> {
  const backendData = {
    title: data.title,
    description: data.description,
    questions: data.questions.map((q) => ({
      text: q.text,
      correctAnswer: q.correctAnswer,
    })),
  };

  const response = await request<RawQuiz>(`/quiz/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
  });

  return mapQuiz(response);
}

export async function deleteQuiz(id: number): Promise<void> {
  return request<void>(`/quiz/${id}`, {
    method: 'DELETE',
  });
}

export async function playQuiz(id: number): Promise<PlayQuizDto> {
  return request<PlayQuizDto>(`/quiz/${id}/play`);
}

export async function getMyQuizzes(): Promise<QuizResponseDto[]> {
  try {
    const response = await request<RawQuiz[]>('/quiz/my-quizzes');
    return (Array.isArray(response) ? response : []).map(mapQuiz);
  } catch (err) {
    if (err instanceof Error && err.message.includes('400')) {
      return [];
    }
    throw err;
  }
}