import {
  ContestPreview,
  Problem,
  ProblemAttempt,
  ProblemCategory,
  ProblemsListParams,
  ProblemsRatingSummary,
  ProblemTag,
} from '../entities';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ProblemsRepository {
  listProblems: (params: ProblemsListParams) => Promise<PageResult<Problem>>;
  listCategories: () => Promise<ProblemCategory[]>;
  listTags: () => Promise<ProblemTag[]>;
  listDifficulties: () => Promise<Array<{ name: string; value: number }>>;
  listLanguages: () => Promise<Array<{ value: string; label: string }>>;
  getUserSummary: (username?: string | null) => Promise<ProblemsRatingSummary | null>;
  listUserAttempts: (username?: string | null) => Promise<ProblemAttempt[]>;
  getLastContestPreview: () => Promise<ContestPreview | null>;
  listMostViewed: () => Promise<Problem[]>;
}
