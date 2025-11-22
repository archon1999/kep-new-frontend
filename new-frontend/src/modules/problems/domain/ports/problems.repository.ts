import { ApiProblemsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  AttemptFilterOption,
  AttemptListItem,
  DifficultyBreakdown,
  PeriodRatingEntry,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemContestPreview,
  ProblemLanguageOption,
  ProblemListItem,
  ProblemsRatingRow,
  ProblemsRatingSummary,
} from '../entities/problem.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export type ProblemsListParams = Omit<ApiProblemsListParams, 'tags' | 'favorites'> & {
  status?: number;
  tags?: number[];
  search?: string;
  favorites?: boolean;
};

export type ProblemsRatingParams = {
  ordering?: string;
  page?: number;
  pageSize?: number;
};

export type AttemptsListParams = {
  ordering?: string;
  username?: string;
  problemId?: number;
  contestId?: number;
  duelId?: number;
  contestProblem?: string;
  duelProblem?: string;
  verdict?: number;
  lang?: string;
  page?: number;
  pageSize?: number;
};

export interface ProblemsRepository {
  list(params: ProblemsListParams): Promise<PageResult<ProblemListItem>>;
  listLanguages(): Promise<ProblemLanguageOption[]>;
  listCategories(): Promise<ProblemCategory[]>;
  listMostViewed(): Promise<ProblemListItem[]>;
  getLastContest(): Promise<ProblemContestPreview | null>;
  listUserAttempts(username: string, pageSize?: number): Promise<ProblemAttemptSummary[]>;
  getUserRating(username: string): Promise<ProblemsRatingSummary | null>;
  listRating(params: ProblemsRatingParams): Promise<PageResult<ProblemsRatingRow>>;
  listPeriodRating(period: 'today' | 'week' | 'month'): Promise<PeriodRatingEntry[]>;
  listAttempts(params: AttemptsListParams): Promise<PageResult<AttemptListItem>>;
  listVerdicts(): Promise<AttemptFilterOption[]>;
  rerunAttempt(attemptId: number): Promise<void>;
  mapDifficulties(stats: unknown): DifficultyBreakdown;
}
