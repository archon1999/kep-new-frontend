import { LastContest, Problem, ProblemAttempt, ProblemTag, ProblemsPageResult, ProblemsRatingRow } from '../../domain/entities/problem.entity.ts';

export const mapProblem = (item: any): Problem => ({
  id: Number(item?.id ?? item?.problemId ?? 0),
  title: item?.title ?? item?.problemTitle ?? '',
  symbol: item?.symbol,
  difficulty: item?.difficulty,
  difficultyTitle: item?.difficultyTitle ?? item?.difficulty_title,
  tags: (item?.tags ?? []).map(mapProblemTag),
  solved: item?.solved ?? item?.solved_count ?? item?.solvedCount,
  notSolved: item?.notSolved ?? item?.not_solved,
  attemptsCount: item?.attemptsCount ?? item?.attempts_count,
  authorUsername: item?.authorUsername ?? item?.author_username,
});

export const mapProblemTag = (item: any): ProblemTag => ({
  id: Number(item?.id ?? 0),
  name: item?.name ?? '',
  category: item?.category,
});

export const mapPageResult = <T>(response: any, mapper: (item: any) => T): ProblemsPageResult<T> => ({
  data: Array.isArray(response?.results ?? response?.data) ? (response.results ?? response.data).map(mapper) : [],
  total: Number(response?.total ?? response?.count ?? 0),
  page: Number(response?.page ?? 1),
  pageSize: Number(response?.pageSize ?? response?.page_size ?? response?.page_size ?? 20),
});

export const mapRatingRow = (item: any): ProblemsRatingRow => ({
  solved: Number(item?.solved ?? 0),
  rating: item?.rating,
  beginner: item?.beginner,
  basic: item?.basic,
  normal: item?.normal,
  medium: item?.medium,
  advanced: item?.advanced,
  hard: item?.hard,
  extremal: item?.extremal,
  allBeginner: item?.allBeginner ?? item?.all_beginner,
  allBasic: item?.allBasic ?? item?.all_basic,
  allNormal: item?.allNormal ?? item?.all_normal,
  allMedium: item?.allMedium ?? item?.all_medium,
  allAdvanced: item?.allAdvanced ?? item?.all_advanced,
  allHard: item?.allHard ?? item?.all_hard,
  allExtremal: item?.allExtremal ?? item?.all_extremal,
});

export const mapAttempt = (item: any): ProblemAttempt => ({
  id: Number(item?.id ?? 0),
  problemId: Number(item?.problemId ?? item?.problem_id ?? 0),
  problemTitle: item?.problemTitle ?? item?.problem_title ?? '',
  verdict: item?.verdict ?? item?.verdictTitle ?? '',
  createdAt: item?.createdAt ?? item?.created_at,
});

export const mapLastContest = (item: any): LastContest | null => {
  if (!item) return null;

  return {
    id: Number(item?.id ?? 0),
    title: item?.title ?? '',
    problems: Array.isArray(item?.problems)
      ? item.problems.map((problem: any) => ({
        id: Number(problem?.id ?? 0),
        symbol: problem?.symbol,
        title: problem?.title ?? '',
      }))
      : [],
  };
};
