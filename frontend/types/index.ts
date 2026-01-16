// DTO Types matching backend
export interface CreateQuizDto {
  title: string;
  description: string;
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
  questions: QuestionResponseDto[];
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
  token: string;
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
