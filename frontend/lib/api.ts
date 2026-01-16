import type {
  CreateQuizDto,
  QuizResponseDto,
  PlayQuizDto,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://full-quiz.azurewebsites.net/api';

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
  async getAllQuizzes(): Promise<QuizResponseDto[]> {
    try {
      return await this.request<QuizResponseDto[]>('/quiz');
    } catch (err) {
      // Om request misslyckas (t.ex. 401), returnera tom array
      if (err instanceof Error && err.message.includes('401')) {
        return [];
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
}

export const apiClient = new ApiClient();
