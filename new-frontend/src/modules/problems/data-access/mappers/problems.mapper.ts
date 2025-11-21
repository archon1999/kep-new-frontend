import {
  ContestPreview,
  PageResult,
  Problem,
  ProblemAttempt,
  ProblemCategory,
  ProblemsRatingSummary,
  ProblemTag,
} from '../../domain';

export const mapProblem = (payload: any): Problem => ({
  id: payload?.id,
  title: payload?.title ?? '',
  difficulty: Number(payload?.difficulty ?? 0),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title ?? '',
  solved: Number(payload?.solved ?? payload?.solved_count ?? 0),
  attemptsCount: Number(payload?.attemptsCount ?? payload?.attempts_count ?? 0),
  likesCount: Number(payload?.likesCount ?? payload?.likes_count ?? 0),
  dislikesCount: Number(payload?.dislikesCount ?? payload?.dislikes_count ?? 0),
  tags: (payload?.tags ?? []).map(mapTag),
  authorUsername: payload?.authorUsername ?? payload?.author_username,
  status: payload?.userInfo?.hasSolved
    ? 'solved'
    : payload?.userInfo?.hasAttempted
      ? 'attempted'
      : 'new',
  hasSolution: Boolean(payload?.hasSolution ?? payload?.has_solution),
  hasChecker: Boolean(payload?.hasChecker ?? payload?.has_checker),
});

export const mapTag = (payload: any): ProblemTag => ({
  id: payload?.id,
  name: payload?.name ?? '',
  category: payload?.category ?? payload?.category_title,
});

export const mapCategory = (payload: any): ProblemCategory => ({
  id: payload?.id,
  title: payload?.title ?? '',
  description: payload?.description,
  code: payload?.code,
  icon: payload?.icon,
  problemsCount: payload?.problemsCount ?? payload?.problems_count,
  tags: (payload?.tags ?? []).map(mapTag),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? payload?.current_page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? payload?.results?.length ?? 0,
  count: payload?.count ?? payload?.results?.length ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.results?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.total_pages ?? payload?.pages_count ?? 0,
  data: (payload?.data ?? payload?.results ?? []).map(mapItem),
});

export const mapRatingSummary = (payload: any): ProblemsRatingSummary => ({
  solved: Number(payload?.solved ?? 0),
  rating: Number(payload?.rating ?? 0),
  rowIndex: payload?.rowIndex ?? payload?.row_index,
  beginner: Number(payload?.beginner ?? 0),
  basic: Number(payload?.basic ?? 0),
  normal: Number(payload?.normal ?? 0),
  medium: Number(payload?.medium ?? 0),
  advanced: Number(payload?.advanced ?? 0),
  hard: Number(payload?.hard ?? 0),
  extremal: Number(payload?.extremal ?? 0),
  allBeginner: Number(payload?.allBeginner ?? payload?.beginnerTotal ?? 0),
  allBasic: Number(payload?.allBasic ?? payload?.basicTotal ?? 0),
  allNormal: Number(payload?.allNormal ?? payload?.normalTotal ?? 0),
  allMedium: Number(payload?.allMedium ?? payload?.mediumTotal ?? 0),
  allAdvanced: Number(payload?.allAdvanced ?? payload?.advancedTotal ?? 0),
  allHard: Number(payload?.allHard ?? payload?.hardTotal ?? 0),
  allExtremal: Number(payload?.allExtremal ?? payload?.extremalTotal ?? 0),
});

export const mapAttempt = (payload: any): ProblemAttempt => ({
  id: payload?.id,
  problemId: payload?.problemId ?? payload?.problem_id,
  problemTitle: payload?.problemTitle ?? payload?.problem_title ?? '',
  verdictTitle: payload?.verdictTitle ?? payload?.verdict_title ?? '',
  verdict: payload?.verdict,
  langFull: payload?.langFull ?? payload?.lang_full ?? payload?.lang,
  created: payload?.created ?? payload?.created_at,
});

export const mapContestPreview = (payload: any): ContestPreview => ({
  id: payload?.id,
  title: payload?.title ?? payload?.name ?? '',
  problems: (payload?.problems ?? []).map((item: any) => ({
    id: item?.id,
    symbol: item?.symbol ?? item?.code ?? '',
    title: item?.title ?? '',
  })),
});
