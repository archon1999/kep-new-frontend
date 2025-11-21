import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Contest, ContestCategory, ContestRatingSummary } from '../../domain/entities/contest.entity';
import { ContestsRepository, PageResult } from '../../domain/ports/contests.repository';
import { contestsApiClient } from '../api/contests.client';
import { mapContest, mapContestCategory, mapContestRating, mapPageResult } from '../mappers/contest.mapper';

export class HttpContestsRepository implements ContestsRepository {
  async list(params?: ApiContestsListParams): Promise<PageResult<Contest>> {
    const result = await contestsApiClient.list(params);
    return mapPageResult(result, mapContest);
  }

  async getCategories(): Promise<ContestCategory[]> {
    const result = await contestsApiClient.getCategories();
    return Array.isArray(result) ? result.map(mapContestCategory) : [];
  }

  async getRating(username: string): Promise<ContestRatingSummary> {
    const result = await contestsApiClient.getRating(username);
    return mapContestRating(result as any);
  }
}
