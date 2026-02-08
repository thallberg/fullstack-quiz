import type {
  CreateQuizDto,
  QuizResponseDto,
  GroupedQuizzesDto,
  PlayQuizDto,
  SubmitQuizResultDto,
  QuizResultDetailsDto,
  LeaderboardDto,
  MyLeaderboardDto,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
  FriendshipInviteDto,
  FriendshipResponseDto,
} from '../types';
import { API_BASE_URL } from './config';

// Token lagras här så att mobilen kan skicka den i Authorization (cookies fungerar inte i RN/Expo).
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      // 401: mobilen har ingen window.location – kasta så att UI kan navigera till login
      if (response.status === 401) {
        const err = new Error('Unauthorized') as Error & { status?: number };
        err.status = 401;
        throw err;
      }

      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            const errors = Object.values(errorData.errors).flat() as string[];
            errorMessage = errors.join(', ');
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        }
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return undefined as T;
      }
      return JSON.parse(text) as T;
    }

    return undefined as T;
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    return this.request<AuthResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    return this.request<AuthResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto> {
    return this.request<AuthResponseDto>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<{ userId: number; username: string; email: string } | null> {
    try {
      const data = await this.request<{ userId?: number; id?: number; username: string; email: string }>('/auth/profile');
      if (!data) return null;
      return {
        userId: data.userId ?? data.id ?? 0,
        username: data.username ?? '',
        email: data.email ?? '',
      };
    } catch {
      return null;
    }
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    const backendData = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    return this.request<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getAllQuizzes(): Promise<GroupedQuizzesDto> {
    try {
      const response = await this.request<any>('/quiz');
      if (response && typeof response === 'object') {
        const myQuizzes = Array.isArray(response.MyQuizzes) ? response.MyQuizzes : Array.isArray(response.myQuizzes) ? response.myQuizzes : [];
        const friendsQuizzes = Array.isArray(response.FriendsQuizzes) ? response.FriendsQuizzes : Array.isArray(response.friendsQuizzes) ? response.friendsQuizzes : [];
        const publicQuizzes = Array.isArray(response.PublicQuizzes) ? response.PublicQuizzes : Array.isArray(response.publicQuizzes) ? response.publicQuizzes : [];
        return { myQuizzes, friendsQuizzes, publicQuizzes };
      }
      return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    } catch (err) {
      if (err instanceof Error && (err as any).status === 401) {
        return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
      }
      throw err;
    }
  }

  async getQuizById(id: number): Promise<QuizResponseDto> {
    return this.request<QuizResponseDto>(`/quiz/${id}`);
  }

  async createQuiz(data: CreateQuizDto): Promise<QuizResponseDto> {
    const backendData = {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      questions: data.questions.map((q) => ({ text: q.text, correctAnswer: q.correctAnswer })),
    };
    return this.request<QuizResponseDto>('/quiz', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto> {
    const backendData = {
      title: data.title,
      description: data.description,
      questions: data.questions.map((q) => ({ text: q.text, correctAnswer: q.correctAnswer })),
    };
    return this.request<QuizResponseDto>(`/quiz/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  }

  async deleteQuiz(id: number): Promise<void> {
    return this.request<void>(`/quiz/${id}`, { method: 'DELETE' });
  }

  async playQuiz(id: number): Promise<PlayQuizDto> {
    return this.request<PlayQuizDto>(`/quiz/${id}/play`);
  }

  async submitQuizResult(data: SubmitQuizResultDto): Promise<void> {
    const backendData = {
      QuizId: data.quizId,
      Score: data.score,
      TotalQuestions: data.totalQuestions,
      Percentage: data.percentage,
      Answers: data.answers?.map((a) => ({ QuestionId: a.questionId, Answer: a.answer })) ?? [],
    };
    return this.request<void>('/quizresult', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getQuizResultDetails(resultId: number): Promise<QuizResultDetailsDto> {
    return this.request<QuizResultDetailsDto>(`/quizresult/${resultId}`);
  }

  async getLeaderboard(): Promise<LeaderboardDto> {
    const response = await this.request<any>('/quizresult/leaderboard');
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
        results: Array.isArray(entry.Results) ? entry.Results.map(mapResult) : Array.isArray(entry.results) ? entry.results.map(mapResult) : [],
      });
      return {
        myQuizzes: Array.isArray(response.MyQuizzes) ? response.MyQuizzes.map(mapEntry) : Array.isArray(response.myQuizzes) ? response.myQuizzes.map(mapEntry) : [],
        friendsQuizzes: Array.isArray(response.FriendsQuizzes) ? response.FriendsQuizzes.map(mapEntry) : Array.isArray(response.friendsQuizzes) ? response.friendsQuizzes.map(mapEntry) : [],
        publicQuizzes: Array.isArray(response.PublicQuizzes) ? response.PublicQuizzes.map(mapEntry) : Array.isArray(response.publicQuizzes) ? response.publicQuizzes.map(mapEntry) : [],
      };
    }
    return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
  }

  async getMyLeaderboard(): Promise<MyLeaderboardDto> {
    const response = await this.request<any>('/quizresult/my-leaderboard');
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
        results: Array.isArray(entry.Results) ? entry.Results.map(mapResult) : Array.isArray(entry.results) ? entry.results.map(mapResult) : [],
      });
      return {
        quizzes: Array.isArray(response.Quizzes) ? response.Quizzes.map(mapEntry) : Array.isArray(response.quizzes) ? response.quizzes.map(mapEntry) : [],
      };
    }
    return { quizzes: [] };
  }

  async getMyQuizzes(): Promise<QuizResponseDto[]> {
    try {
      return await this.request<QuizResponseDto[]>('/quiz/my-quizzes');
    } catch (err) {
      if (err instanceof Error && err.message.includes('400')) {
        return [];
      }
      throw err;
    }
  }

  async sendFriendInvite(data: FriendshipInviteDto): Promise<FriendshipResponseDto> {
    return this.request<FriendshipResponseDto>('/friendship/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptFriendInvite(id: number): Promise<FriendshipResponseDto> {
    return this.request<FriendshipResponseDto>(`/friendship/${id}/accept`, { method: 'POST' });
  }

  async declineFriendInvite(id: number): Promise<void> {
    return this.request<void>(`/friendship/${id}/decline`, { method: 'POST' });
  }

  async getPendingInvites(): Promise<FriendshipResponseDto[]> {
    try {
      return await this.request<FriendshipResponseDto[]>('/friendship/pending');
    } catch (err) {
      if (err instanceof Error && err.message.includes('400')) {
        return [];
      }
      throw err;
    }
  }

  async getFriends(): Promise<FriendshipResponseDto[]> {
    try {
      return await this.request<FriendshipResponseDto[]>('/friendship/friends');
    } catch (err) {
      if (err instanceof Error && err.message.includes('400')) {
        return [];
      }
      throw err;
    }
  }

  async removeFriend(id: number): Promise<void> {
    return this.request<void>(`/friendship/${id}`, { method: 'DELETE' });
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
  }
}

export const apiClient = new ApiClient();
