import { DifficultiesBreakdown, ProblemAttemptPreview, ProblemHighlight, ProblemsSummary } from '../../domain/entities/stats.entity.ts';
import { Problem, ProblemTag } from '../../domain/entities/problem.entity.ts';
import { PageResult } from '../../domain/ports/problems.repository.ts';

export const mapProblem = (payload: any): Problem => ({
  id: Number(payload?.id ?? 0),
  title: payload?.title ?? payload?.name ?? '---',
  difficulty: Number(payload?.difficulty ?? payload?.difficultyLevel ?? 0),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title ?? payload?.difficulty_name ?? '---',
  solvedCount: Number(payload?.solved ?? payload?.solved_count ?? payload?.accepted ?? 0),
  attemptsCount: Number(payload?.attemptsCount ?? payload?.attempts ?? payload?.submissions ?? 0),
  likesCount: payload?.likesCount ?? payload?.likes ?? 0,
  dislikesCount: payload?.dislikesCount ?? payload?.dislikes ?? 0,
  hasSolution: Boolean(payload?.hasSolution ?? payload?.has_solution ?? false),
  hasChecker: Boolean(payload?.hasChecker ?? payload?.has_checker ?? false),
  tags: (payload?.tags ?? []).map((tag: any): ProblemTag => ({
    id: tag?.id,
    name: tag?.name ?? String(tag ?? ''),
    category: tag?.category,
  })),
  topics: (payload?.topics ?? payload?.topic ?? []).map((topic: any) => ({
    id: topic?.id,
    name: topic?.name ?? String(topic ?? ''),
  })),
  authorUsername: payload?.authorUsername ?? payload?.author_username,
});

export const mapProblemsPage = (payload: any): PageResult<Problem> => {
  const data = payload?.data ?? payload?.results ?? payload?.items ?? [];
  const pageSize = Number(payload?.pageSize ?? payload?.page_size ?? payload?.limit ?? data.length ?? 0) || 10;
  const total = Number(payload?.total ?? payload?.count ?? data.length ?? 0);
  const page = Number(payload?.page ?? payload?.current_page ?? 1);
  const pagesCount = Number(payload?.pagesCount ?? payload?.num_pages ?? Math.max(1, Math.ceil(total / pageSize)));

  return {
    page,
    pageSize,
    count: total,
    total,
    pagesCount,
    data: data.map(mapProblem),
  };
};

export const mapSummary = (payload: any): ProblemsSummary => ({
  solved: Number(payload?.solved ?? 0),
  rating: payload?.rating ?? payload?.ratingValue ?? undefined,
  attempts: payload?.attempts ?? payload?.attemptsCount ?? undefined,
  likesReceived: payload?.likes ?? payload?.likesReceived ?? undefined,
  userRank: payload?.rowIndex ?? payload?.rank ?? undefined,
  totalProblems: payload?.totalProblems ?? payload?.total ?? undefined,
});

export const mapDifficulties = (payload: any): DifficultiesBreakdown => ({
  beginner: Number(payload?.beginner ?? 0),
  basic: Number(payload?.basic ?? 0),
  normal: Number(payload?.normal ?? 0),
  medium: Number(payload?.medium ?? 0),
  advanced: Number(payload?.advanced ?? 0),
  hard: Number(payload?.hard ?? 0),
  extremal: Number(payload?.extremal ?? 0),
  allBeginner: Number(payload?.allBeginner ?? payload?.beginnerTotal ?? payload?.all_beginner ?? 0),
  allBasic: Number(payload?.allBasic ?? payload?.basicTotal ?? payload?.all_basic ?? 0),
  allNormal: Number(payload?.allNormal ?? payload?.normalTotal ?? payload?.all_normal ?? 0),
  allMedium: Number(payload?.allMedium ?? payload?.mediumTotal ?? payload?.all_medium ?? 0),
  allAdvanced: Number(payload?.allAdvanced ?? payload?.advancedTotal ?? payload?.all_advanced ?? 0),
  allHard: Number(payload?.allHard ?? payload?.hardTotal ?? payload?.all_hard ?? 0),
  allExtremal: Number(payload?.allExtremal ?? payload?.extremalTotal ?? payload?.all_extremal ?? 0),
  totalSolved: Number(payload?.solved ?? payload?.totalSolved ?? 0),
  totalProblems: Number(payload?.totalProblems ?? payload?.total ?? 0),
});

export const mapAttemptPreview = (payload: any): ProblemAttemptPreview => ({
  id: Number(payload?.id ?? 0),
  problemId: payload?.problemId ?? payload?.problem_id,
  problemTitle: payload?.problemTitle ?? payload?.problem_title ?? payload?.problem?.title ?? '---',
  verdict: payload?.verdict ?? payload?.verdictName ?? '---',
  language: payload?.language ?? payload?.lang,
  createdAt: payload?.createdAt ?? payload?.created_at,
});

export const mapProblemHighlight = (payload: any): ProblemHighlight => ({
  id: Number(payload?.id ?? 0),
  title: payload?.title ?? payload?.name ?? '---',
  difficulty: Number(payload?.difficulty ?? payload?.difficultyLevel ?? 0),
  difficultyTitle: payload?.difficultyTitle ?? payload?.difficulty_title ?? payload?.difficulty_name ?? '---',
  attemptsCount: payload?.attemptsCount ?? payload?.attempts ?? payload?.submissions,
});
