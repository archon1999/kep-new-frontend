import { Problem } from '../../domain/entities/problem.entity.ts';
import { ProblemsRatingSummary } from '../../domain/entities/problems-rating.entity.ts';
import {
  PageResult,
  ProblemCategory,
  ProblemDifficultyOption,
  ProblemLanguage,
  ProblemListItem,
} from '../../domain/ports/problems.repository.ts';

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const mapProblem = (payload: any): Problem => ({
  id: toNumber(payload?.id),
  title: payload?.title ?? '',
  difficulty: toNumber(payload?.difficulty),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title,
  solved: toNumber(payload?.solved),
  attemptsCount: toNumber(payload?.attemptsCount ?? payload?.attempts_count),
  likesCount: toNumber(payload?.likesCount ?? payload?.likes_count),
  dislikesCount: toNumber(payload?.dislikesCount ?? payload?.dislikes_count),
  hasSolution: Boolean(payload?.hasSolution ?? payload?.has_solution),
  hasChecker: payload?.hasChecker ?? payload?.has_checker ?? true,
  hidden: Boolean(payload?.hidden),
  tags: (payload?.tags ?? []).map((tag: any) => ({
    id: toNumber(tag?.id),
    name: tag?.name ?? '',
  })),
  userInfo: payload?.userInfo || payload?.user_info || payload?.userinfo || undefined,
});

export const mapPageResult = <T>(payload: any, mapper: (item: any) => T): PageResult<T> => ({
  page: toNumber(payload?.page, 1),
  pageSize: toNumber(payload?.pageSize ?? payload?.page_size, 0),
  count: toNumber(payload?.count, 0),
  total: toNumber(payload?.total ?? payload?.count ?? 0, 0),
  pagesCount: toNumber(payload?.pagesCount ?? payload?.pages_count, 0),
  data: (payload?.data ?? []).map((item: any) => mapper(item)),
});

export const mapCategory = (payload: any): ProblemCategory => ({
  id: toNumber(payload?.id),
  title: payload?.title ?? '',
  code: payload?.code ?? '',
  description: payload?.description,
  problemsCount: toNumber(payload?.problemsCount ?? payload?.problems_count),
  icon: payload?.icon,
  tags: (payload?.tags ?? []).map((tag: any) => ({
    id: toNumber(tag?.id),
    name: tag?.name ?? '',
  })),
});

export const mapDifficultyOption = (payload: any): ProblemDifficultyOption => ({
  value: toNumber(payload?.value ?? payload?.id),
  name: payload?.name ?? payload?.title ?? '',
});

export const mapLanguage = (payload: any): ProblemLanguage => ({
  lang: payload?.lang ?? payload?.code ?? '',
  langFull: payload?.langFull ?? payload?.full ?? payload?.name ?? '',
});

export const mapProblemListItem = (payload: any): ProblemListItem => ({
  id: toNumber(payload?.id),
  symbol: payload?.symbol,
  title: payload?.title ?? '',
});

export const mapProblemsRatingSummary = (payload: any): ProblemsRatingSummary => ({
  solved: toNumber(payload?.solved),
  rating: toNumber(payload?.rating),
  rank: toNumber(payload?.rank ?? payload?.place),
  usersCount: toNumber(payload?.usersCount ?? payload?.users_count),
  beginner: toNumber(payload?.beginner),
  basic: toNumber(payload?.basic),
  normal: toNumber(payload?.normal),
  medium: toNumber(payload?.medium),
  advanced: toNumber(payload?.advanced),
  hard: toNumber(payload?.hard),
  extremal: toNumber(payload?.extremal),
  allBeginner: toNumber(payload?.allBeginner),
  allBasic: toNumber(payload?.allBasic),
  allNormal: toNumber(payload?.allNormal),
  allMedium: toNumber(payload?.allMedium),
  allAdvanced: toNumber(payload?.allAdvanced),
  allHard: toNumber(payload?.allHard),
  allExtremal: toNumber(payload?.allExtremal),
});
