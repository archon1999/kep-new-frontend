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

export interface KepcoinSummary {
  kepcoin: number;
  streak: number;
  streakFreeze: number;
}

export interface KepcoinTransactionDetail {
  [key: string]: unknown;
}

interface KepcoinTransactionBase {
  id: string | number;
  kepcoin: number;
  datetime: string;
  detail?: KepcoinTransactionDetail | null;
}

export interface KepcoinEarn extends KepcoinTransactionBase {
  earnType: EarnType;
}

export interface KepcoinSpend extends KepcoinTransactionBase {
  type: SpendType;
}

export interface KepcoinTransactionsQuery {
  page?: number;
  perPage?: number;
}

export interface KepcoinTransactionsResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}
