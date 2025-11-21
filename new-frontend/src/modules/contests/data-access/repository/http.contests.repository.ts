import { ApiContestsListParams, ApiContestsRatingListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem, ContestRatingRow } from '../../domain/entities/contest.entity';
import { ContestsRepository, PageResult } from '../../domain/ports/contests.repository';
import { contestsApiClient } from '../api/contests.client';
import { mapCategory, mapContest, mapContestRating, mapPageResult } from '../mappers/contest.mapper';

export class HttpContestsRepository implements ContestsRepository {
  async list(params?: ApiContestsListParams): Promise<PageResult<ContestListItem>> {
    const result = await contestsApiClient.list(params);
    return mapPageResult(result, mapContest);
  }

  async categories(): Promise<ContestCategoryEntity[]> {
    const result = await contestsApiClient.categories();
    return result.map(mapCategory);
  }

  async rating(params?: ApiContestsRatingListParams): Promise<PageResult<ContestRatingRow>> {
    const result = await contestsApiClient.rating(params);
    const mapped = mapPageResult(result, mapContestRating);

    return {
      ...mapped,
      data: mapped.data.map((row, index) => ({
        ...row,
        rowIndex: row.rowIndex || ((mapped.page - 1) * (mapped.pageSize || mapped.data.length || 1)) + index + 1,
      })),
    };
  }
}
