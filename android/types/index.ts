// DTO Types matching backend (same as frontend)
export interface CreateQuizDto {
  title: string;
  description: string;
  isPublic: boolean;
  questions: CreateQuestionDto[];
}

export interface CreateQuestionDto {
  text: string;
  correctAnswer: boolean;
}

export interface QuizResponseDto {
  id: number;
  title: string;
  description: string;
  userId: number;
  username: string;
  createdAt: string;
  isPublic: boolean;
  questions: QuestionResponseDto[];
}

export interface GroupedQuizzesDto {
  myQuizzes: QuizResponseDto[];
  friendsQuizzes: QuizResponseDto[];
  publicQuizzes: QuizResponseDto[];
}

export interface SubmitQuizResultDto {
  quizId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
}

export interface QuizResultEntryDto {
  resultId: number;
  userId: number;
  username: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface QuizLeaderboardEntryDto {
  quizId: number;
  quizTitle: string;
  results: QuizResultEntryDto[];
}

export interface LeaderboardDto {
  myQuizzes: QuizLeaderboardEntryDto[];
  friendsQuizzes: QuizLeaderboardEntryDto[];
  publicQuizzes: QuizLeaderboardEntryDto[];
}

export interface MyLeaderboardDto {
  quizzes: QuizLeaderboardEntryDto[];
}

export interface QuestionResponseDto {
  id: number;
  text: string;
  correctAnswer: boolean;
}

export interface PlayQuizDto {
  id: number;
  title: string;
  questions: PlayQuestionDto[];
}

export interface PlayQuestionDto {
  id: number;
  text: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token?: string;
  userId: number;
  username: string;
  email: string;
}

export interface UpdateProfileDto {
  username: string;
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface FriendshipInviteDto {
  email: string;
}

export interface FriendshipResponseDto {
  id: number;
  requesterId: number;
  requesterUsername: string;
  requesterEmail: string;
  addresseeId: number;
  addresseeUsername: string;
  addresseeEmail: string;
  status: string;
  createdAt: string;
  acceptedAt?: string;
}
