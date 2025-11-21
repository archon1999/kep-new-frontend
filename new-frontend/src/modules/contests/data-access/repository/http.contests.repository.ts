import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { contestsApiClient } from '../api/contests.client';
import { mapContest, mapContestCategory, mapPageResult } from '../mappers/contest.mapper';
import { ContestCategoryEntity, ContestListItem } from '../../domain/entities/contest.entity';
import { ContestsRepository, PageResult } from '../../domain/ports/contests.repository';

export class HttpContestsRepository implements ContestsRepository {
  async list(params?: ApiContestsListParams): Promise<PageResult<ContestListItem>> {
    const result = await contestsApiClient.list(params);
    return mapPageResult(result, mapContest);
  }

  async getCategories(): Promise<ContestCategoryEntity[]> {
    const categories = await contestsApiClient.categories();
    return categories.map(mapContestCategory);
  }
}
