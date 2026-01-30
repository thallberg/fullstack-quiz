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
} from '../../types';

export interface QuizDataSource {
  register(data: RegisterDto): Promise<AuthResponseDto>;
  login(data: LoginDto): Promise<AuthResponseDto>;
  updateProfile(data: UpdateProfileDto): Promise<AuthResponseDto>;
  changePassword(data: ChangePasswordDto): Promise<void>;

  getAllQuizzes(): Promise<GroupedQuizzesDto>;
  getQuizById(id: number): Promise<QuizResponseDto>;
  getMyQuizzes(): Promise<QuizResponseDto[]>;
  createQuiz(data: CreateQuizDto): Promise<QuizResponseDto>;
  updateQuiz(id: number, data: CreateQuizDto): Promise<QuizResponseDto>;
  deleteQuiz(id: number): Promise<void>;
  playQuiz(id: number): Promise<PlayQuizDto>;
  submitQuizResult(data: SubmitQuizResultDto): Promise<void>;
  getLeaderboard(): Promise<LeaderboardDto>;
  getMyLeaderboard(): Promise<MyLeaderboardDto>;

  sendFriendInvite(data: FriendshipInviteDto): Promise<FriendshipResponseDto>;
  acceptFriendInvite(id: number): Promise<FriendshipResponseDto>;
  declineFriendInvite(id: number): Promise<void>;
  getPendingInvites(): Promise<FriendshipResponseDto[]>;
  getFriends(): Promise<FriendshipResponseDto[]>;
  removeFriend(id: number): Promise<void>;
}
