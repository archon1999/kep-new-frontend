import { DifficultiesBreakdown, ProblemAttemptPreview, ProblemHighlight, ProblemsSummary } from '../entities/stats.entity.ts';
import { Problem, ProblemsPageFilters } from '../entities/problem.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ProblemsRepository {
  listProblems: (params?: ProblemsPageFilters & { page?: number; pageSize?: number }) => Promise<PageResult<Problem>>;
  getSummary: (username?: string | null) => Promise<ProblemsSummary>;
  getDifficulties: (username?: string | null) => Promise<DifficultiesBreakdown>;
  getLastAttempts: (params?: { page?: number; pageSize?: number }) => Promise<ProblemAttemptPreview[]>;
  getLastContestProblems: (params?: { page?: number; pageSize?: number }) => Promise<ProblemHighlight[]>;
  getMostViewed: (params?: { page?: number; pageSize?: number }) => Promise<ProblemHighlight[]>;
}
