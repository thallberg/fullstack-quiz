import type {
  CreateQuizDto,
  QuizResponseDto,
  GroupedQuizzesDto,
  PlayQuizDto,
} from '@/types';
import { request } from './client';

export async function getAllQuizzes(): Promise<GroupedQuizzesDto> {
  try {
    const response = await request<any>('/quiz');

    // Map from backend PascalCase to frontend camelCase
    if (response && typeof response === 'object') {
      // Ensure all properties are arrays
      const myQuizzes = Array.isArray(response.MyQuizzes)
        ? response.MyQuizzes
        : Array.isArray(response.myQuizzes)
        ? response.myQuizzes
        : [];
      const friendsQuizzes = Array.isArray(response.FriendsQuizzes)
        ? response.FriendsQuizzes
        : Array.isArray(response.friendsQuizzes)
        ? response.friendsQuizzes
        : [];
      const publicQuizzes = Array.isArray(response.PublicQuizzes)
        ? response.PublicQuizzes
        : Array.isArray(response.publicQuizzes)
        ? response.publicQuizzes
        : [];

      return {
        myQuizzes,
        friendsQuizzes,
        publicQuizzes,
      };
    }

    return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
  } catch (err) {
    // Om request misslyckas (t.ex. 401), returnera tom gruppering
    if (err instanceof Error && err.message.includes('401')) {
      return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    }
    throw err;
  }
}

export async function getQuizById(id: number): Promise<QuizResponseDto> {
  return request<QuizResponseDto>(`/quiz/${id}`);
}

export async function createQuiz(data: CreateQuizDto): Promise<QuizResponseDto> {
  // Map to backend format (camelCase to PascalCase)
  const backendData = {
    title: data.title,
    description: data.description,
    isPublic: data.isPublic,
    questions: data.questions.map(q => ({
      text: q.text,
      correctAnswer: q.correctAnswer,
    })),
  };

  return request<QuizResponseDto>('/quiz', {
    method: 'POST',
    body: JSON.stringify(backendData),
  });
}

export async function updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto> {
  // Map to backend format (camelCase to PascalCase)
  const backendData = {
    title: data.title,
    description: data.description,
    questions: data.questions.map(q => ({
      text: q.text,
      correctAnswer: q.correctAnswer,
    })),
  };

  return request<QuizResponseDto>(`/quiz/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
  });
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
    return await request<QuizResponseDto[]>('/quiz/my-quizzes');
  } catch (err) {
    // Om det är ett 400-fel, returnera tom array (användaren har inga quiz)
    if (err instanceof Error && err.message.includes('400')) {
      return [];
    }
    throw err;
  }
}
