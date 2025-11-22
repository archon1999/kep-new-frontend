import { CategoryTag, ProblemList, ProblemsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ProblemTag } from '../../domain/entities/problem.entity.ts';
import {
  AttemptFilterOption,
  AttemptListItem,
  DifficultyBreakdown,
  PeriodRatingEntry,
  ProblemAttemptSummary,
  ProblemCategory,
  ProblemLanguageOption,
  ProblemListItem,
  ProblemUserSummary,
  ProblemsRatingRow,
  ProblemsRatingSummary,
} from '../../domain/entities/problem.entity.ts';
import { PageResult } from '../../domain/ports/problems.repository.ts';

const toNumber = (value: unknown) => (typeof value === 'number' ? value : Number(value) || 0);
const toNullableNumber = (value: any) =>
  value === null || value === undefined || value === '' ? undefined : toNumber(value);

export const mapProblemTag = (tag: CategoryTag | ProblemTag | { id?: number | string; name?: string; category?: string }): {
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
  notSolved: toNumber((problem as any).notSolved ?? (problem as any).not_solved),
  attemptsCount: toNumber((problem as any).attemptsCount),
  tags: (problem.tags ?? []).map((tag) => mapProblemTag(tag)),
  likesCount: toNumber((problem as any).likesCount),
  dislikesCount: toNumber((problem as any).dislikesCount),
  hasSolution: Boolean((problem as any).hasSolution),
  hasChecker: (problem as any).hasChecker !== false,
  hidden: Boolean((problem as any).hidden),
  userInfo: typeof (problem as any).userInfo === 'object' ? (problem as any).userInfo : undefined,
});

const mapPageResult = <T>(
  payload: any,
  mapItem: (item: any, index: number, page: number, pageSize: number) => T,
): PageResult<T> => {
  const page = payload?.page ?? (payload as any)?.current_page ?? 1;
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const pageSize =
    payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? (data.length ? data.length : 0);
  const total = payload?.total ?? payload?.count ?? data.length ?? 0;
  const pagesCount =
    payload?.pagesCount ??
    payload?.pages_count ??
    payload?.total_pages ??
    (pageSize ? Math.ceil(total / (pageSize || 1)) : 1);

  return {
    page,
    pageSize,
    total,
    pagesCount,
    data: data.map((item: any, index: number) => mapItem(item, index, page, pageSize)),
  };
};

export const mapProblemsPage = (payload: any): PageResult<ProblemListItem> =>
  mapPageResult(payload, (item) => mapProblem(item as ProblemList));

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

export const mapProblemUser = (payload: any): ProblemUserSummary => ({
  username: payload?.username ?? '',
  firstName: payload?.firstName ?? payload?.first_name,
  lastName: payload?.lastName ?? payload?.last_name,
  avatar: payload?.avatar ?? payload?.photo ?? payload?.avatarUrl,
  rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title,
});

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

export const mapProblemsRatingRow = (
  payload: any,
  index: number,
  page: number,
  pageSize: number,
): ProblemsRatingRow => {
  const baseIndex = Math.max(0, (page - 1) * pageSize);
  return {
    rowIndex: toNumber(payload?.rowIndex ?? payload?.row_index ?? baseIndex + index + 1),
    rating: payload?.rating !== undefined ? toNumber(payload.rating) : undefined,
    solved: payload?.solved !== undefined ? toNumber(payload.solved) : undefined,
    beginner: toNumber(payload?.beginner),
    basic: toNumber(payload?.basic),
    normal: toNumber(payload?.normal),
    medium: toNumber(payload?.medium),
    advanced: toNumber(payload?.advanced),
    hard: toNumber(payload?.hard),
    extremal: toNumber(payload?.extremal),
    user: mapProblemUser(payload?.user ?? payload),
  };
};

export const mapProblemsRatingPage = (payload: any): PageResult<ProblemsRatingRow> =>
  mapPageResult(payload, mapProblemsRatingRow);

export const mapAttempt = (payload: any): AttemptListItem => ({
  id: payload?.id ?? 0,
  user: mapProblemUser(payload?.user ?? {}),
  teamName: payload?.team?.name,
  problemId: toNumber(payload?.problemId ?? payload?.problem_id),
  problemTitle: payload?.problemTitle ?? '',
  contestProblemSymbol:
    payload?.contestProblem?.symbol ??
    payload?.contest_problem?.symbol ??
    payload?.contestProblemSymbol ??
    payload?.contest_problem_symbol,
  contestId:
    payload?.contestProblem?.contest ??
    payload?.contest_problem?.contest ??
    payload?.contestId ??
    payload?.contest_id,
  contestTime: payload?.contestTime ?? payload?.contest_time ?? null,
  verdict: payload?.verdict !== undefined ? toNumber(payload.verdict) : undefined,
  verdictTitle: payload?.verdictTitle ?? '',
  lang: payload?.lang ?? '',
  langFull: payload?.langFull ?? payload?.lang_full ?? payload?.lang,
  testCaseNumber: toNullableNumber(payload?.testCaseNumber ?? payload?.test_case_number),
  time: toNullableNumber(payload?.time),
  memory: toNullableNumber(payload?.memory),
  sourceCodeSize: toNullableNumber(payload?.sourceCodeSize ?? payload?.source_code_size),
  balls: toNullableNumber(payload?.balls),
  canView: payload?.canView ?? payload?.can_view,
  canTestView: payload?.canTestView ?? payload?.can_test_view,
  kepcoinValue: toNullableNumber(payload?.kepcoinValue ?? payload?.kepcoin_value),
  testCaseKepcoinValue: toNullableNumber(
    payload?.testCaseKepcoinValue ?? payload?.test_case_kepcoin_value,
  ),
  created: payload?.created,
  problemHasCheckInput: payload?.problemHasCheckInput ?? payload?.problem_has_check_input,
});

export const mapAttemptsPage = (payload: any): PageResult<AttemptListItem> =>
  mapPageResult(payload, (item) => mapAttempt(item));

export const mapVerdicts = (payload: any): AttemptFilterOption[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const mapped = data.map((item: any): AttemptFilterOption => ({
    label: item.label ?? item.title ?? item.verdictTitle ?? String(item.value ?? item.verdict ?? ''),
    value: toNumber(item.value ?? item.verdict ?? item.id),
  }));

  return mapped.filter((item: AttemptFilterOption) => Boolean(item.label));
};

export const mapPeriodRating = (payload: any): PeriodRatingEntry[] => {
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data.map((item: any) => ({
    username: item.username ?? item.user?.username ?? '',
    solved: toNumber(item.solved ?? item.result),
    ratingTitle: item.ratingTitle ?? item.user?.ratingTitle,
  }));
};
