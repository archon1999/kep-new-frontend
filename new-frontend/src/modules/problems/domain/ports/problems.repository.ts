import { ApiProblemsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  DifficultyBreakdown,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemContestPreview,
  ProblemLanguageOption,
  ProblemListItem,
  ProblemsRatingSummary,
} from '../entities/problem.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export type ProblemsListParams = ApiProblemsListParams & {
  status?: number;
  tags?: number[];
  search?: string;
  favorites?: boolean;
};

export interface ProblemsRepository {
  list(params: ProblemsListParams): Promise<PageResult<ProblemListItem>>;
  listLanguages(): Promise<ProblemLanguageOption[]>;
  listCategories(): Promise<ProblemCategory[]>;
  listMostViewed(): Promise<ProblemListItem[]>;
  getLastContest(): Promise<ProblemContestPreview | null>;
  listUserAttempts(username: string, pageSize?: number): Promise<ProblemAttemptSummary[]>;
  getUserRating(username: string): Promise<ProblemsRatingSummary | null>;
  mapDifficulties(stats: unknown): DifficultyBreakdown;
}
