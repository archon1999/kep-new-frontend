import { ApiAttemptsListParams, ApiProblemsListParams, ApiProblemsRatingListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  mapAttempts,
  mapCategories,
  mapContestPreview,
  mapDifficultyBreakdown,
  mapLanguages,
  mapPeriodRating,
  mapProblemsRatingPage,
  mapProblemsPage,
  mapRatingSummary,
  mapAttemptsPage,
  mapVerdicts,
} from '../mappers/problems.mapper.ts';
import { problemsApiClient } from '../api/problems.client.ts';
import {
  AttemptListItem,
  PeriodRatingEntry,
  ProblemListItem,
  ProblemsRatingRow,
  ProblemsRatingSummary,
} from '../../domain/entities/problem.entity.ts';
import {
  AttemptsListParams,
  PageResult,
  ProblemsListParams,
  ProblemsRatingParams,
  ProblemsRepository,
} from '../../domain/ports/problems.repository.ts';

const mapFilterToApiParams = (params: ProblemsListParams): ApiProblemsListParams => {
  const { tags, status, favorites, search, ...rest } = params;
  const apiParams: ApiProblemsListParams = {
    ...rest,
  };

  if (status === 1) {
    apiParams.has_solved = '1';
  } else if (status === 2) {
    apiParams.has_solved = '0';
    apiParams.has_attempted = '1';
  } else if (status === 3) {
    apiParams.has_solved = '0';
    apiParams.has_attempted = '0';
  }

  if (tags?.length) {
    apiParams.tags = tags.join(',');
  }

  if (favorites) {
    apiParams.favorites = 'true';
  }

  if (search) {
    apiParams.search = search;
  }

  return apiParams;
};

export class HttpProblemsRepository implements ProblemsRepository {
  async list(params: ProblemsListParams): Promise<PageResult<ProblemListItem>> {
    const page = await problemsApiClient.list(mapFilterToApiParams(params));
    return mapProblemsPage(page);
  }

  async listLanguages() {
    const response = await problemsApiClient.listLanguages();
    return mapLanguages(response);
  }

  async listCategories() {
    const categories = await problemsApiClient.listCategories();
    return mapCategories(categories);
  }

  async listMostViewed() {
    const response = await problemsApiClient.listMostViewed();
    return mapProblemsPage(response).data;
  }

  async getLastContest() {
    const response = await problemsApiClient.getLastContest();
    return mapContestPreview(response);
  }

  async listUserAttempts(username: string, pageSize = 10) {
    const response = await problemsApiClient.listUserAttempts({ username, pageSize });
    return mapAttempts(response);
  }

  async getUserRating(username: string): Promise<ProblemsRatingSummary | null> {
    const response = await problemsApiClient.getUserRating(username);
    const difficulties = this.mapDifficulties(response);
    return mapRatingSummary(response, difficulties);
  }

  async listRating(params: ProblemsRatingParams): Promise<PageResult<ProblemsRatingRow>> {
    const response = await problemsApiClient.listRating(mapRatingFilter(params));
    return mapProblemsRatingPage(response);
  }

  async listPeriodRating(period: 'today' | 'week' | 'month'): Promise<PeriodRatingEntry[]> {
    const response = await problemsApiClient.listPeriodRating(period);
    return mapPeriodRating(response);
  }

  async listAttempts(params: AttemptsListParams): Promise<PageResult<AttemptListItem>> {
    const response = await problemsApiClient.listAttempts(mapAttemptsFilter(params));
    return mapAttemptsPage(response);
  }

  async listVerdicts() {
    const response = await problemsApiClient.listVerdicts();
    return mapVerdicts(response);
  }

  async rerunAttempt(attemptId: number): Promise<void> {
    await problemsApiClient.rerunAttempt(attemptId);
  }

  mapDifficulties(stats: unknown) {
    return mapDifficultyBreakdown(stats);
  }
}

const mapRatingFilter = (params: ProblemsRatingParams): ApiProblemsRatingListParams => ({
  ordering: params.ordering,
  page: params.page,
  pageSize: params.pageSize,
});

const mapAttemptsFilter = (params: AttemptsListParams): ApiAttemptsListParams => ({
  ordering: params.ordering,
  username: params.username || undefined,
  problem_id: params.problemId !== undefined ? String(params.problemId) : undefined,
  contest_id: params.contestId !== undefined ? String(params.contestId) : undefined,
  duel_id: params.duelId !== undefined ? String(params.duelId) : undefined,
  contest_problem: params.contestProblem,
  duel_problem: params.duelProblem,
  verdict: params.verdict !== undefined ? String(params.verdict) : undefined,
  lang: params.lang || undefined,
  page: params.page,
  pageSize: params.pageSize,
});
