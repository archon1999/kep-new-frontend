import { ContestUserStatisticsResponse } from '../../domain/entities/contest-user-statistics.entity';

export const mapContestUserStatistics = (
  payload: any,
): ContestUserStatisticsResponse => ({
  general: {
    username: payload?.general?.username ?? '',
    ratingTitle: payload?.general?.ratingTitle ?? payload?.general?.rating_title ?? '',
    contestantsCount: Number(payload?.general?.contestantsCount ?? payload?.general?.contestants_count ?? 0),
    maxRating: Number(payload?.general?.maxRating ?? payload?.general?.max_rating ?? 0),
    maxRatingTitle: payload?.general?.maxRatingTitle ?? payload?.general?.max_rating_title ?? '',
    ratingPlace: Number(payload?.general?.ratingPlace ?? payload?.general?.rating_place ?? 0),
    rating: Number(payload?.general?.rating ?? 0),
  },
  overview: {
    totalAttempts: Number(payload?.overview?.totalAttempts ?? payload?.overview?.total_attempts ?? 0),
    totalAccepted: Number(payload?.overview?.totalAccepted ?? payload?.overview?.total_accepted ?? 0),
    averageAttemptsPerProblem:
      Number(payload?.overview?.averageAttemptsPerProblem ?? payload?.overview?.average_attempts_per_problem ?? 0),
    mostAttemptsProblem: payload?.overview?.mostAttemptsProblem ?? payload?.overview?.most_attempts_problem ?? null,
    singleAttemptProblems: payload?.overview?.singleAttemptProblems ?? payload?.overview?.single_attempt_problems ?? null,
    fastestSolve: payload?.overview?.fastestSolve ?? payload?.overview?.fastest_solve ?? null,
    slowestSolve: payload?.overview?.slowestSolve ?? payload?.overview?.slowest_solve ?? null,
  },
  contestRanks: payload?.contestRanks ?? payload?.contest_ranks ?? null,
  contestDeltas: payload?.contestDeltas ?? payload?.contest_deltas ?? null,
  unsolvedProblems: payload?.unsolvedProblems ?? payload?.unsolved_problems ?? [],
  languages: payload?.languages ?? [],
  verdicts: payload?.verdicts ?? [],
  tags: payload?.tags ?? [],
  symbols: payload?.symbols ?? [],
  timeline: payload?.timeline ?? [],
  topAttempts: payload?.topAttempts ?? payload?.top_attempts ?? [],
  worthyOpponents: payload?.worthyOpponents ?? payload?.worthy_opponents ?? [],
});
