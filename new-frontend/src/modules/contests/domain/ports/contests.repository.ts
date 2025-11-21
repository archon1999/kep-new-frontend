import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem, PageResult } from '../entities/contest.entity';

export interface ContestsRepository {
  list(params?: ApiContestsListParams): Promise<PageResult<ContestListItem>>;
  categories(): Promise<ContestCategoryEntity[]>;
}
