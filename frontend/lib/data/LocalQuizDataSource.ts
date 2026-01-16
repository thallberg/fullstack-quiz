import type { QuizDataSource } from './QuizDataSource';
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

// Storage keys
const QUIZ_KEY = 'quizApp_quizzes';
const USER_KEY = 'quizApp_users';
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'user';
const LAST_ID_KEY = 'quizApp_lastId';

// Helper functions
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getStorageKey(key: string): string {
  return key;
}

function getNextId(key: string): number {
  if (!isBrowser()) return 0;
  const lastId = parseInt(localStorage.getItem(`${LAST_ID_KEY}_${key}`) || '0', 10);
  const nextId = lastId + 1;
  localStorage.setItem(`${LAST_ID_KEY}_${key}`, nextId.toString());
  return nextId;
}

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

function getCurrentUser(): { userId: number; username: string; email: string } | null {
  if (!isBrowser()) return null;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  return parseToken(token);
}

function loadQuizzes(): QuizResponseDto[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(QUIZ_KEY);
  return data ? JSON.parse(data) : [];
}

function saveQuizzes(quizzes: QuizResponseDto[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));
}

function loadUsers(): Array<{ id: number; username: string; email: string; passwordHash: string }> {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: Array<{ id: number; username: string; email: string; passwordHash: string }>): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export const localQuizDataSource: QuizDataSource = {
  // Auth
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const users = loadUsers();
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    const userId = getNextId('user');
    const user = {
      id: userId,
      username: data.username,
      email: data.email,
      passwordHash: btoa(data.password),
    };

    users.push(user);
    saveUsers(users);

    const token = generateToken(userId, data.username, data.email);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return {
      token,
      userId,
      username: data.username,
      email: data.email,
    };
  },

  async login(data: LoginDto): Promise<AuthResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const users = loadUsers();
    const user = users.find(u => u.email === data.email);
    
    if (!user || atob(user.passwordHash) !== data.password) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id, user.username, user.email);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return {
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  },

  async updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== users[userIndex].email) {
      if (users.find(u => u.email === data.email && u.id !== currentUser.userId)) {
        throw new Error('Email already in use');
      }
    }

    if (data.username) users[userIndex].username = data.username;
    if (data.email) users[userIndex].email = data.email;

    saveUsers(users);

    const updatedUser = users[userIndex];
    const token = generateToken(updatedUser.id, updatedUser.username, updatedUser.email);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return {
      token,
      userId: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    };
  },

  async changePassword(data: ChangePasswordDto): Promise<void> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const user = users.find(u => u.id === currentUser.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (atob(user.passwordHash) !== data.currentPassword) {
      throw new Error('Current password is incorrect');
    }

    user.passwordHash = btoa(data.newPassword);
    saveUsers(users);
  },

  // Quiz
  async getAllQuizzes(): Promise<QuizResponseDto[]> {
    if (!isBrowser()) return [];
    return loadQuizzes();
  },

  async getQuizById(id: number): Promise<QuizResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = loadQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  },

  async getMyQuizzes(): Promise<QuizResponseDto[]> {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const quizzes = loadQuizzes();
    return quizzes.filter(q => q.userId === currentUser.userId);
  },

  async createQuiz(data: CreateQuizDto): Promise<QuizResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizId = getNextId('quiz');
    const quiz: QuizResponseDto = {
      id: quizId,
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      userId: currentUser.userId,
      username: currentUser.username,
      questions: data.questions.map((q) => ({
        id: getNextId('question'),
        text: q.text,
        correctAnswer: q.correctAnswer,
      })),
    };

    const quizzes = loadQuizzes();
    quizzes.push(quiz);
    saveQuizzes(quizzes);

    return quiz;
  },

  async updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = loadQuizzes();
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
      id: getNextId('question'),
      text: q.text,
      correctAnswer: q.correctAnswer,
    }));

    saveQuizzes(quizzes);
    return quizzes[quizIndex];
  },

  async deleteQuiz(id: number): Promise<void> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const quizzes = loadQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    if (quizzes[quizIndex].userId !== currentUser.userId) {
      throw new Error('Unauthorized');
    }

    quizzes.splice(quizIndex, 1);
    saveQuizzes(quizzes);
  },

  async playQuiz(id: number): Promise<PlayQuizDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const quizzes = loadQuizzes();
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
  },
};
