import type {
  CreateQuizDto,
  QuizResponseDto,
  GroupedQuizzesDto,
  PlayQuizDto,
  SubmitQuizResultDto,
  LeaderboardDto,
  MyLeaderboardDto,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
  FriendshipInviteDto,
  FriendshipResponseDto,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api';


class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = new Headers(options.headers);
    
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        // Don't redirect on login/register pages
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      
      // Try to extract error message from response
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            // Handle ModelState errors
            const errors = Object.values(errorData.errors).flat() as string[];
            errorMessage = errors.join(', ');
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        }
      } catch {
        // If parsing fails, use default message
      }
      
      throw new Error(errorMessage);
    }

    // Handle 204 No Content (empty response body)
    if (response.status === 204) {
      return undefined as T;
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return undefined as T;
      }
      return JSON.parse(text) as T;
    }

    // If no content type or not JSON, return undefined
    return undefined as T;
  }

  // Auth endpoints
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

  async changePassword(data: ChangePasswordDto): Promise<void> {
    // Map to backend format (camelCase to PascalCase)
    const backendData = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    
    return this.request<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  // Quiz endpoints
  async getAllQuizzes(): Promise<GroupedQuizzesDto> {
    try {
      const response = await this.request<any>('/quiz');
      
      // Map from backend PascalCase to frontend camelCase
      if (response && typeof response === 'object') {
        // Ensure all properties are arrays
        const myQuizzes = Array.isArray(response.MyQuizzes) ? response.MyQuizzes : 
                         Array.isArray(response.myQuizzes) ? response.myQuizzes : [];
        const friendsQuizzes = Array.isArray(response.FriendsQuizzes) ? response.FriendsQuizzes : 
                              Array.isArray(response.friendsQuizzes) ? response.friendsQuizzes : [];
        const publicQuizzes = Array.isArray(response.PublicQuizzes) ? response.PublicQuizzes : 
                             Array.isArray(response.publicQuizzes) ? response.publicQuizzes : [];
        
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

  async getQuizById(id: number): Promise<QuizResponseDto> {
    return this.request<QuizResponseDto>(`/quiz/${id}`);
  }

  async createQuiz(data: CreateQuizDto): Promise<QuizResponseDto> {
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
    
    return this.request<QuizResponseDto>('/quiz', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto> {
    // Map to backend format (camelCase to PascalCase)
    const backendData = {
      title: data.title,
      description: data.description,
      questions: data.questions.map(q => ({
        text: q.text,
        correctAnswer: q.correctAnswer,
      })),
    };
    
    return this.request<QuizResponseDto>(`/quiz/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  }

  async deleteQuiz(id: number): Promise<void> {
    return this.request<void>(`/quiz/${id}`, {
      method: 'DELETE',
    });
  }

  async playQuiz(id: number): Promise<PlayQuizDto> {
    return this.request<PlayQuizDto>(`/quiz/${id}/play`);
  }

  // Quiz Result endpoints
  async submitQuizResult(data: SubmitQuizResultDto): Promise<void> {
    const backendData = {
      QuizId: data.quizId,
      Score: data.score,
      TotalQuestions: data.totalQuestions,
      Percentage: data.percentage,
    };
    
    return this.request<void>('/quizresult', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getLeaderboard(): Promise<LeaderboardDto> {
    const response = await this.request<any>('/quizresult/leaderboard');
    
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

  async getMyLeaderboard(): Promise<MyLeaderboardDto> {
    const response = await this.request<any>('/quizresult/my-leaderboard');
    
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

  async getMyQuizzes(): Promise<QuizResponseDto[]> {
    try {
      return await this.request<QuizResponseDto[]>('/quiz/my-quizzes');
    } catch (err) {
      // Om det är ett 400-fel, returnera tom array (användaren har inga quiz)
      if (err instanceof Error && err.message.includes('400')) {
        return [];
      }
      throw err;
    }
  }

  // Friendship endpoints
  async sendFriendInvite(data: FriendshipInviteDto): Promise<FriendshipResponseDto> {
    return this.request<FriendshipResponseDto>('/friendship/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptFriendInvite(id: number): Promise<FriendshipResponseDto> {
    return this.request<FriendshipResponseDto>(`/friendship/${id}/accept`, {
      method: 'POST',
    });
  }

  async declineFriendInvite(id: number): Promise<void> {
    return this.request<void>(`/friendship/${id}/decline`, {
      method: 'POST',
    });
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
    return this.request<void>(`/friendship/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
