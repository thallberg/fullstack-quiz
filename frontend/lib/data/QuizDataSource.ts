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

export interface QuizDataSource {
  // Auth
  register(data: RegisterDto): Promise<AuthResponseDto>;
  login(data: LoginDto): Promise<AuthResponseDto>;
  updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto>;
  changePassword(data: ChangePasswordDto): Promise<void>;
  
  // Quiz
  getAllQuizzes(): Promise<QuizResponseDto[]>;
  getQuizById(id: number): Promise<QuizResponseDto>;
  getMyQuizzes(): Promise<QuizResponseDto[]>;
  createQuiz(data: CreateQuizDto): Promise<QuizResponseDto>;
  updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto>;
  deleteQuiz(id: number): Promise<void>;
  playQuiz(id: number): Promise<PlayQuizDto>;
}
