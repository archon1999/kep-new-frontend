import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem } from '../../domain/entities/contest.entity';
import { ContestRatingRow } from '../../domain/entities/contest-rating.entity';
import { ContestsRepository, PageResult } from '../../domain/ports/contests.repository';
import { contestsApiClient } from '../api/contests.client';
import { mapCategory, mapContest, mapContestRating, mapPageResult } from '../mappers/contest.mapper';
import {
  mapContestRatingChange,
  mapContestUserStatistics,
} from '../mappers/contest-statistics.mapper';

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
    return mapPageResult(result, mapContestRating);
  }

  async userStatistics(username: string) {
    const result = await contestsApiClient.userStatistics(username);
    if (!result) return null;
    return mapContestUserStatistics(result);
  }

  async ratingChanges(username: string) {
    const result = await contestsApiClient.ratingChanges(username);
    return (result ?? []).map(mapContestRatingChange);
  }
}
