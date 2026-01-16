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

// Simple JWT-like token generator (for localStorage mode)
function generateToken(userId: number, username: string, email: string): string {
  const payload = {
    userId,
    username,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
}

function parseToken(token: string): { userId: number; username: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Token expired
    }
    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

class LocalStorageApi {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getStorageKey(key: string): string {
    return `quizApp_${key}`;
  }

  private getCurrentUser(): { userId: number; username: string; email: string } | null {
    if (!this.isBrowser()) return null;
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    return parseToken(token);
  }

  private getNextId(key: string): number {
    if (!this.isBrowser()) return 0;
    const lastId = parseInt(localStorage.getItem(this.getStorageKey(`lastId_${key}`)) || '0', 10);
    const nextId = lastId + 1;
    localStorage.setItem(this.getStorageKey(`lastId_${key}`), nextId.toString());
    return nextId;
  }

  // Auth endpoints
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    // Check if user already exists
    const users = this.getUsers();
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    const userId = this.getNextId('user');
    const user = {
      id: userId,
      username: data.username,
      email: data.email,
      passwordHash: btoa(data.password), // Simple encoding (not secure, but works for localStorage)
    };

    users.push(user);
    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));

    const token = generateToken(userId, data.username, data.email);
    localStorage.setItem('authToken', token);

    return {
      token,
      user: {
        id: userId,
        username: data.username,
        email: data.email,
      },
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const users = this.getUsers();
    const user = users.find(u => u.email === data.email);
    
    if (!user || atob(user.passwordHash) !== data.password) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id, user.username, user.email);
    localStorage.setItem('authToken', token);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if email is already taken by another user
    if (data.email && data.email !== users[userIndex].email) {
      if (users.find(u => u.email === data.email && u.id !== currentUser.userId)) {
        throw new Error('Email already in use');
      }
    }

    if (data.username) users[userIndex].username = data.username;
    if (data.email) users[userIndex].email = data.email;

    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));

    const updatedUser = users[userIndex];
    const token = generateToken(updatedUser.id, updatedUser.username, updatedUser.email);
    localStorage.setItem('authToken', token);

    return {
      token,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    };
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === currentUser.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    if (atob(user.passwordHash) !== data.currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.passwordHash = btoa(data.newPassword);
    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
  }

  // Quiz endpoints
  async getAllQuizzes(): Promise<QuizResponseDto[]> {
    if (!this.isBrowser()) return [];
    return this.getQuizzes();
  }

  async getQuizById(id: number): Promise<QuizResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = this.getQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  }

  async createQuiz(data: CreateQuizDto): Promise<QuizResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizId = this.getNextId('quiz');
    const quiz: QuizResponseDto = {
      id: quizId,
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      userId: currentUser.userId,
      username: currentUser.username,
      questions: data.questions.map((q, index) => ({
        id: this.getNextId('question'),
        text: q.text,
        correctAnswer: q.correctAnswer,
      })),
    };

    const quizzes = this.getQuizzes();
    quizzes.push(quiz);
    localStorage.setItem(this.getStorageKey('quizzes'), JSON.stringify(quizzes));

    return quiz;
  }

  async updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = this.getQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    if (quizzes[quizIndex].userId !== currentUser.userId) {
      throw new Error('Unauthorized');
    }

    quizzes[quizIndex].title = data.title;
    quizzes[quizIndex].description = data.description;
    // Create new questions with new IDs (matching backend behavior)
    quizzes[quizIndex].questions = data.questions.map((q) => ({
      id: this.getNextId('question'),
      text: q.text,
      correctAnswer: q.correctAnswer,
    }));

    localStorage.setItem(this.getStorageKey('quizzes'), JSON.stringify(quizzes));
    return quizzes[quizIndex];
  }

  async deleteQuiz(id: number): Promise<void> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = this.getQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    if (quizzes[quizIndex].userId !== currentUser.userId) {
      throw new Error('Unauthorized');
    }

    quizzes.splice(quizIndex, 1);
    localStorage.setItem(this.getStorageKey('quizzes'), JSON.stringify(quizzes));
  }

  async playQuiz(id: number): Promise<PlayQuizDto> {
    if (!this.isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = this.getQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return {
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
      })),
    };
  }

  async getMyQuizzes(): Promise<QuizResponseDto[]> {
    if (!this.isBrowser()) return [];
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const quizzes = this.getQuizzes();
    return quizzes.filter(q => q.userId === currentUser.userId);
  }

  // Helper methods
  private getUsers(): Array<{ id: number; username: string; email: string; passwordHash: string }> {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(this.getStorageKey('users'));
    return data ? JSON.parse(data) : [];
  }

  private getQuizzes(): QuizResponseDto[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(this.getStorageKey('quizzes'));
    return data ? JSON.parse(data) : [];
  }
}

export const localStorageApi = new LocalStorageApi();
