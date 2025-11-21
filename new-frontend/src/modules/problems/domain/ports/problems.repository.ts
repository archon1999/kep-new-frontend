import { Problem } from '../entities/problem.entity.ts';
import { ProblemsFilter } from '../entities/problems-filter.entity.ts';
import { ProblemsRatingSummary } from '../entities/problems-rating.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ProblemCategory {
  id: number;
  title: string;
  code: string;
  description?: string;
  problemsCount?: number;
  icon?: string;
  tags: { id: number; name: string }[];
}

export interface ProblemLanguage {
  lang: string;
  langFull: string;
}

export interface ProblemDifficultyOption {
  value: number;
  name: string;
}

export interface ProblemListItem {
  id: number;
  symbol?: string;
  title: string;
}

export interface ProblemsRepository {
  listProblems: (filter?: ProblemsFilter) => Promise<PageResult<Problem>>;
  listCategories: () => Promise<ProblemCategory[]>;
  listDifficulties: () => Promise<ProblemDifficultyOption[]>;
  listLanguages: () => Promise<ProblemLanguage[]>;
  getUserRatingSummary: (username: string) => Promise<ProblemsRatingSummary>;
  listMostViewed: () => Promise<ProblemListItem[]>;
  getLastContestProblems: () => Promise<{ id: number; title: string; problems: ProblemListItem[] } | null>;
  listLastAttempts: (username: string) => Promise<ProblemListItem[]>;
}
