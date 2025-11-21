import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { contestsApiClient } from '../api/contests.client';
import { mapContest, mapContestCategory, mapPageResult } from '../mappers/contest.mapper';
import { ContestCategoryEntity, ContestListItem, PageResult } from '../../domain/entities/contest.entity';
import { ContestsRepository } from '../../domain/ports/contests.repository';

export class HttpContestsRepository implements ContestsRepository {
  async list(params?: ApiContestsListParams): Promise<PageResult<ContestListItem>> {
    const result = await contestsApiClient.list(params);
    return mapPageResult(result, mapContest);
  }

  async categories(): Promise<ContestCategoryEntity[]> {
    const result = await contestsApiClient.categories();
    return result.map(mapContestCategory);
  }
}
