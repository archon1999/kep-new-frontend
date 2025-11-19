export enum EarnType {
  WroteBlog = 1,
  WroteProblemSolution = 2,
  LoyaltyBonus = 3,
  BonusFromAdmin = 4,
  DailyActivity = 5,
  DailyTaskCompletion = 6,
  DailyProblemsRatingWin = 7,
  WeeklyProblemsRatingWin = 8,
  MonthlyProblemsRatingWin = 9,
  ContestParticipated = 10,
  ArenaParticipated = 11,
  TournamentParticipated = 12,
  ProjectTaskComplete = 13,
}

export enum SpendType {
  AttemptView = 1,
  AttemptTestView = 2,
  ProblemSolution = 3,
  DoubleRating = 4,
  CoverPhotoChange = 5,
  Course = 6,
  StudyPlan = 7,
  CodeEditorTesting = 8,
  SaveRating = 9,
  TestPass = 10,
  UserContestCreate = 11,
  Project = 12,
  StreakFreeze = 13,
  VirtualContest = 14,
  UnratedContest = 15,
  AnswerForInput = 16,
  CheckSamples = 17,
  Merch = 18,
}

export interface KepcoinTimelineDetail {
  date?: string;
  description?: string;
  contest?: { id: number | string; title?: string };
  arena?: { id: number | string; title?: string };
  test?: { id: number | string; title?: string };
  problem?: { id: number | string; title?: string };
  attemptId?: number | string;
  project?: { id: number | string; title?: string };
  coverPhoto?: string;
  [key: string]: any;
}

export interface KepcoinEarn {
  id?: number | string;
  kepcoin: number;
  datetime: string;
  earnType: EarnType;
  detail?: KepcoinTimelineDetail | null;
}

export interface KepcoinSpend {
  id?: number | string;
  kepcoin: number;
  datetime: string;
  type: SpendType;
  detail?: KepcoinTimelineDetail | null;
}

export interface KepcoinPaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface KepcoinQueryParams {
  page?: number;
  pageSize?: number;
}

export interface KepcoinStreakInfo {
  streak: number;
  streakFreeze: number;
  maxStreak?: number;
}

export interface PurchaseResponse {
  success?: boolean;
  message?: string;
}
