import type { FriendshipResponseDto, QuizResponseDto } from '@/types';

// Storage keys
const QUIZ_KEY = 'quizApp_quizzes';
const USER_KEY = 'quizApp_users';
const FRIENDSHIP_KEY = 'quizApp_friendships';
const QUIZ_RESULT_KEY = 'quizApp_quizResults';
const AUTH_TOKEN_KEY = 'authToken';
const LAST_ID_KEY = 'quizApp_lastId';

export type StoredUser = {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
};

export type StoredQuizResult = {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
};

export type CurrentUser = {
  userId: number;
  username: string;
  email: string;
};

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getNextId(key: string): number {
  if (!isBrowser()) return 0;
  const lastId = parseInt(localStorage.getItem(`${LAST_ID_KEY}_${key}`) || '0', 10);
  const nextId = lastId + 1;
  localStorage.setItem(`${LAST_ID_KEY}_${key}`, nextId.toString());
  return nextId;
}

export function generateToken(userId: number, username: string, email: string): string {
  const payload = {
    userId,
    username,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
}

export function parseToken(token: string): CurrentUser | null {
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

export function setAuthToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser(): CurrentUser | null {
  const token = getAuthToken();
  if (!token) return null;
  return parseToken(token);
}

export function loadQuizzes(): QuizResponseDto[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(QUIZ_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveQuizzes(quizzes: QuizResponseDto[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));
}

export function loadUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export function loadFriendships(): FriendshipResponseDto[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(FRIENDSHIP_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFriendships(friendships: FriendshipResponseDto[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(FRIENDSHIP_KEY, JSON.stringify(friendships));
}

export function loadQuizResults(): StoredQuizResult[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(QUIZ_RESULT_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveQuizResults(results: StoredQuizResult[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(results));
}
