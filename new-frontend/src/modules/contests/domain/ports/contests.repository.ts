import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem } from '../entities/contest.entity';
import { ContestRatingRow } from '../entities/contest-rating.entity';
import {
  ContestRatingChange,
  ContestUserStatistics,
} from '../entities/contest-user-statistics.entity';
import { ContestTopContestant } from '../entities/contest.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ContestsRepository {
  list: (params?: ApiContestsListParams) => Promise<PageResult<ContestListItem>>;
  categories: () => Promise<ContestCategoryEntity[]>;
  rating: (params?: ApiContestsRatingListParams) => Promise<PageResult<ContestRatingRow>>;
  userStatistics: (username: string) => Promise<ContestUserStatistics | null>;
  ratingChanges: (username: string) => Promise<ContestRatingChange[]>;
  top3Contestants: (contestId: number | string) => Promise<ContestTopContestant[]>;
}
