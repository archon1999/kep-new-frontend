import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Contest, ContestCategory, ContestRatingSummary } from '../entities/contest.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ContestsRepository {
  list: (params?: ApiContestsListParams) => Promise<PageResult<Contest>>;
  getCategories: () => Promise<ContestCategory[]>;
  getRating: (username: string) => Promise<ContestRatingSummary>;
}
