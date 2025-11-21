import { ApiProblemsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  mapAttempts,
  mapCategories,
  mapContestPreview,
  mapDifficultyBreakdown,
  mapLanguages,
  mapProblemsPage,
  mapRatingSummary,
} from '../mappers/problems.mapper.ts';
import { problemsApiClient } from '../api/problems.client.ts';
import {
  ProblemListItem,
  ProblemsRatingSummary,
} from '../../domain/entities/problem.entity.ts';
import {
  PageResult,
  ProblemsListParams,
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

  mapDifficulties(stats: unknown) {
    return mapDifficultyBreakdown(stats);
  }
}
