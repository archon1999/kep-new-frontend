import { CategoryTag, ProblemList, ProblemsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  DifficultyBreakdown,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemLanguageOption,
  ProblemListItem,
  ProblemsRatingSummary,
} from '../../domain/entities/problem.entity.ts';
import { PageResult } from '../../domain/ports/problems.repository.ts';

const toNumber = (value: unknown) => (typeof value === 'number' ? value : Number(value) || 0);

export const mapProblemTag = (tag: CategoryTag | { id?: number | string; name?: string; category?: string }): {
  id: number;
  name: string;
  category?: string;
} => ({
  id: toNumber((tag as any)?.id),
  name: (tag as any)?.name ?? '',
  category: (tag as any)?.category,
});

export const mapProblem = (problem: ProblemList): ProblemListItem => ({
  id: problem.id ?? 0,
  title: problem.title,
  difficulty: toNumber(problem.difficulty),
  difficultyTitle: problem.difficultyTitle,
  solved: toNumber(problem.solved),
  attemptsCount: toNumber((problem as any).attemptsCount),
  tags: (problem.tags ?? []).map((tag) => mapProblemTag(tag as CategoryTag)),
  likesCount: toNumber((problem as any).likesCount),
  dislikesCount: toNumber((problem as any).dislikesCount),
  hasSolution: Boolean((problem as any).hasSolution),
  hasChecker: (problem as any).hasChecker !== false,
  hidden: Boolean((problem as any).hidden),
  userInfo: typeof (problem as any).userInfo === 'object' ? (problem as any).userInfo : undefined,
});

export const mapProblemsPage = (page: any): PageResult<ProblemListItem> => {
  const data = Array.isArray(page?.data) ? page.data : (page ?? []);
  return {
    page: page?.page ?? 1,
    pageSize: page?.pageSize ?? data.length ?? 0,
    pagesCount: page?.pagesCount ?? 1,
    total: page?.total ?? data.length ?? 0,
    data: (data as ProblemList[]).map(mapProblem),
  };
};

export const mapLanguages = (response: any): ProblemLanguageOption[] => {
  const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  return items.map((item: any) => ({
    lang: item.lang ?? '',
    langFull: item.langFull ?? item.lang ?? '',
  }));
};

export const mapCategories = (categories: ProblemsCategory[]): ProblemCategory[] =>
  (categories ?? []).map((category) => ({
    id: category.id ?? 0,
    title: category.title,
    code: category.code,
    description: category.description,
    problemsCount: toNumber(category.problemsCount),
    tags: (category.tags ?? []).map((tag) => mapProblemTag({ ...tag, category: category.title })),
  }));

export const mapAttempts = (response: any): ProblemAttemptSummary[] => {
  const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  return data.map((item: any) => ({
    id: item.id ?? 0,
    problemId: item.problemId ?? 0,
    problemTitle: item.problemTitle ?? '',
  }));
};

export const mapContestPreview = (response: any) => {
  if (!response) return null;
  return {
    id: response.id ?? 0,
    title: response.title ?? '',
    problems: (response.problems ?? []).map((problem: any) => ({
      id: problem.id ?? 0,
      symbol: problem.symbol,
      title: problem.title ?? '',
    })),
  };
};

export const mapRatingSummary = (response: any, difficulties: DifficultyBreakdown): ProblemsRatingSummary | null => {
  if (!response) return null;

  return {
    solved: toNumber(response.solved),
    rating: toNumber(response.rating),
    rank: toNumber(response.rank),
    usersCount: toNumber(response.usersCount),
    difficulties,
  };
};

export const mapDifficultyBreakdown = (stats: any): DifficultyBreakdown => {
  const totals = {
    allBeginner: toNumber(stats?.allBeginner),
    allBasic: toNumber(stats?.allBasic),
    allNormal: toNumber(stats?.allNormal),
    allMedium: toNumber(stats?.allMedium),
    allAdvanced: toNumber(stats?.allAdvanced),
    allHard: toNumber(stats?.allHard),
    allExtremal: toNumber(stats?.allExtremal),
  };

  const totalProblems = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const totalSolved = toNumber(stats?.solved ?? stats?.totalSolved);

  return {
    beginner: toNumber(stats?.beginner),
    allBeginner: totals.allBeginner,
    basic: toNumber(stats?.basic),
    allBasic: totals.allBasic,
    normal: toNumber(stats?.normal),
    allNormal: totals.allNormal,
    medium: toNumber(stats?.medium),
    allMedium: totals.allMedium,
    advanced: toNumber(stats?.advanced),
    allAdvanced: totals.allAdvanced,
    hard: toNumber(stats?.hard),
    allHard: totals.allHard,
    extremal: toNumber(stats?.extremal),
    allExtremal: totals.allExtremal,
    totalSolved,
    totalProblems,
  };
};
