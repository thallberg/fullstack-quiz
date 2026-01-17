import type { QuizDataSource } from './QuizDataSource';
import type {
  CreateQuizDto,
  QuizResponseDto,
  GroupedQuizzesDto,
  PlayQuizDto,
  SubmitQuizResultDto,
  LeaderboardDto,
  QuizLeaderboardEntryDto,
  QuizResultEntryDto,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
  FriendshipInviteDto,
  FriendshipResponseDto,
} from '@/types';

// Storage keys
const QUIZ_KEY = 'quizApp_quizzes';
const USER_KEY = 'quizApp_users';
const FRIENDSHIP_KEY = 'quizApp_friendships';
const QUIZ_RESULT_KEY = 'quizApp_quizResults';
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
  async getAllQuizzes(): Promise<GroupedQuizzesDto> {
    if (!isBrowser()) return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // If not authenticated, only return public quizzes
      const allQuizzes = loadQuizzes();
      return {
        myQuizzes: [],
        friendsQuizzes: [],
        publicQuizzes: allQuizzes.filter(q => q.isPublic !== false), // Default to public if not set
      };
    }
    
    const allQuizzes = loadQuizzes();
    const friends = loadFriendships();
    const friendIds = new Set<number>();
    
    // Get friend IDs
    friends.forEach(f => {
      if (f.status === 'Accepted') {
        if (f.requesterId === currentUser.userId) {
          friendIds.add(f.addresseeId);
        } else if (f.addresseeId === currentUser.userId) {
          friendIds.add(f.requesterId);
        }
      }
    });
    
    // Group quizzes
    const myQuizzes = allQuizzes.filter(q => q.userId === currentUser.userId);
    const friendsQuizzes = allQuizzes.filter(q => 
      q.isPublic === false && friendIds.has(q.userId)
    );
    const publicQuizzes = allQuizzes.filter(q => 
      q.isPublic !== false && q.userId !== currentUser.userId && !friendIds.has(q.userId)
    );
    
    return {
      myQuizzes,
      friendsQuizzes,
      publicQuizzes,
    };
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
      isPublic: data.isPublic ?? true,
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
    quizzes[quizIndex].isPublic = data.isPublic ?? true;
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

  // Friendships (simplified localStorage implementation)
  async sendFriendInvite(data: FriendshipInviteDto): Promise<FriendshipResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = loadUsers();
    const addressee = users.find(u => u.email === data.email);
    if (!addressee) {
      throw new Error('Användare med denna e-post finns inte');
    }
    if (addressee.id === currentUser.userId) {
      throw new Error('Du kan inte bjuda in dig själv');
    }

    const friendships = loadFriendships();
    const existing = friendships.find(f => 
      (f.requesterId === currentUser.userId && f.addresseeId === addressee.id) ||
      (f.requesterId === addressee.id && f.addresseeId === currentUser.userId)
    );

    if (existing) {
      if (existing.status === 'Pending') {
        throw new Error('Inbjudan finns redan');
      }
      if (existing.status === 'Accepted') {
        throw new Error('Ni är redan vänner');
      }
    }

    const friendshipId = getNextId('friendship');
    const friendship: FriendshipResponseDto = {
      id: friendshipId,
      requesterId: currentUser.userId,
      requesterUsername: currentUser.username,
      requesterEmail: currentUser.email,
      addresseeId: addressee.id,
      addresseeUsername: addressee.username,
      addresseeEmail: addressee.email,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    friendships.push(friendship);
    saveFriendships(friendships);
    return friendship;
  },

  async acceptFriendInvite(id: number): Promise<FriendshipResponseDto> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const friendship = friendships.find(f => f.id === id && f.addresseeId === currentUser.userId);
    if (!friendship) {
      throw new Error('Inbjudan hittades inte');
    }
    if (friendship.status !== 'Pending') {
      throw new Error('Inbjudan är inte längre giltig');
    }

    friendship.status = 'Accepted';
    friendship.acceptedAt = new Date().toISOString();
    saveFriendships(friendships);
    return friendship;
  },

  async declineFriendInvite(id: number): Promise<void> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const index = friendships.findIndex(f => f.id === id && f.addresseeId === currentUser.userId);
    if (index === -1) {
      throw new Error('Inbjudan hittades inte');
    }

    friendships.splice(index, 1);
    saveFriendships(friendships);
  },

  async getPendingInvites(): Promise<FriendshipResponseDto[]> {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const friendships = loadFriendships();
    return friendships.filter(f => f.addresseeId === currentUser.userId && f.status === 'Pending');
  },

  async getFriends(): Promise<FriendshipResponseDto[]> {
    if (!isBrowser()) return [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const friendships = loadFriendships();
    return friendships.filter(f => 
      f.status === 'Accepted' && 
      (f.requesterId === currentUser.userId || f.addresseeId === currentUser.userId)
    );
  },

  async removeFriend(id: number): Promise<void> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const friendships = loadFriendships();
    const index = friendships.findIndex(f => 
      f.id === id && 
      (f.requesterId === currentUser.userId || f.addresseeId === currentUser.userId)
    );
    if (index === -1) {
      throw new Error('Vänskap hittades inte');
    }

    friendships.splice(index, 1);
    saveFriendships(friendships);
  },

  // Quiz Results
  async submitQuizResult(data: SubmitQuizResultDto): Promise<void> {
    if (!isBrowser()) {
      throw new Error('localStorage is only available in browser');
    }
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const results = loadQuizResults();
    const resultId = getNextId('quizResult');
    
    const result = {
      id: resultId,
      userId: currentUser.userId,
      quizId: data.quizId,
      score: data.score,
      totalQuestions: data.totalQuestions,
      percentage: data.percentage,
      completedAt: new Date().toISOString(),
    };

    results.push(result);
    saveQuizResults(results);
  },

  async getLeaderboard(): Promise<LeaderboardDto> {
    if (!isBrowser()) return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { myQuizzes: [], friendsQuizzes: [], publicQuizzes: [] };
    }

    const allQuizzes = loadQuizzes();
    const results = loadQuizResults();
    const friendships = loadFriendships();
    const friendIds = new Set<number>();

    // Get friend IDs
    friendships.forEach(f => {
      if (f.status === 'Accepted') {
        if (f.requesterId === currentUser.userId) {
          friendIds.add(f.addresseeId);
        } else if (f.addresseeId === currentUser.userId) {
          friendIds.add(f.requesterId);
        }
      }
    });

    // Get my quizzes
    const myQuizzes = allQuizzes.filter(q => q.userId === currentUser.userId);
    
    // Get friends' quizzes (both public and private)
    const friendsQuizzes = allQuizzes.filter(q => 
      friendIds.has(q.userId)
    );
    
    // Get public quizzes NOT created by user or friends
    const myQuizIds = new Set(myQuizzes.map(q => q.id));
    const friendsQuizIds = new Set(friendsQuizzes.map(q => q.id));
    const publicQuizzes = allQuizzes.filter(q => 
      q.isPublic && !myQuizIds.has(q.id) && !friendsQuizIds.has(q.id)
    );

    // Helper to get all results for a quiz, sorted by percentage (descending)
    const getAllResultsForQuiz = (quizId: number): QuizResultEntryDto[] => {
      const quizResults = results.filter(r => r.quizId === quizId);
      const users = loadUsers();
      
      return quizResults
        .map(result => {
          const user = users.find(u => u.id === result.userId);
          return {
            resultId: result.id,
            userId: result.userId,
            username: user?.username || 'Okänd',
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            completedAt: result.completedAt,
          };
        })
        .sort((a, b) => {
          // Sort by percentage descending, then by completed date descending
          if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
          }
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        });
    };

    // Build my quizzes leaderboard (top 5 per quiz)
    const myQuizzesLeaderboard: QuizLeaderboardEntryDto[] = myQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    // Build friends quizzes leaderboard (top 5 per quiz)
    const friendsQuizzesLeaderboard: QuizLeaderboardEntryDto[] = friendsQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    // Build public quizzes leaderboard (top 5 per quiz)
    const publicQuizzesLeaderboard: QuizLeaderboardEntryDto[] = publicQuizzes.map(quiz => ({
      quizId: quiz.id,
      quizTitle: quiz.title,
      results: getAllResultsForQuiz(quiz.id).slice(0, 5), // Top 5 results
    }));

    return {
      myQuizzes: myQuizzesLeaderboard,
      friendsQuizzes: friendsQuizzesLeaderboard,
      publicQuizzes: publicQuizzesLeaderboard,
    };
  },
};

function loadFriendships(): FriendshipResponseDto[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(FRIENDSHIP_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFriendships(friendships: FriendshipResponseDto[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(FRIENDSHIP_KEY, JSON.stringify(friendships));
}

function loadQuizResults(): Array<{
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}> {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(QUIZ_RESULT_KEY);
  return data ? JSON.parse(data) : [];
}

function saveQuizResults(results: Array<{
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}>): void {
  if (!isBrowser()) return;
  localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(results));
}
