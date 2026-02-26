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

type RawQuestion = {
  Id: number;
  Text: string;
  CorrectAnswer: boolean;
};

type RawQuiz = {
  Id: number;
  Title: string;
  Description: string;
  UserId: number;
  Username: string;
  CreatedAt: string;
  IsPublic: boolean;
  Questions: RawQuestion[];
};

type RawGroupedQuizzes = {
  MyQuizzes: RawQuiz[];
  FriendsQuizzes: RawQuiz[];
  PublicQuizzes: RawQuiz[];
};

/* ============================= */
/* ========= MAPPERS =========== */
/* ============================= */

function mapQuestion(question: RawQuestion): QuestionResponseDto {
  return {
    id: question.Id,
    text: question.Text,
    correctAnswer: question.CorrectAnswer,
  };
}

function mapQuiz(quiz: RawQuiz): QuizResponseDto {
  return {
    id: quiz.Id,
    title: quiz.Title,
    description: quiz.Description,
    userId: quiz.UserId,
    username: quiz.Username,
    createdAt: quiz.CreatedAt,
    isPublic: quiz.IsPublic,
    questions: quiz.Questions.map(mapQuestion),
  };
}

/* ============================= */
/* ========= API CALLS ========= */
/* ============================= */

export async function getAllQuizzes(): Promise<GroupedQuizzesDto> {
  try {
    const response = await request<RawGroupedQuizzes>('/quiz');

    return {
      myQuizzes: response.MyQuizzes.map(mapQuiz),
      friendsQuizzes: response.FriendsQuizzes.map(mapQuiz),
      publicQuizzes: response.PublicQuizzes.map(mapQuiz),
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
    Title: data.title,
    Description: data.description,
    IsPublic: data.isPublic,
    Questions: data.questions.map((q) => ({
      Text: q.text,
      CorrectAnswer: q.correctAnswer,
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
    Title: data.title,
    Description: data.description,
    Questions: data.questions.map((q) => ({
      Text: q.text,
      CorrectAnswer: q.correctAnswer,
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
    return response.map(mapQuiz);
  } catch (err) {
    if (err instanceof Error && err.message.includes('400')) {
      return [];
    }
    throw err;
  }
}