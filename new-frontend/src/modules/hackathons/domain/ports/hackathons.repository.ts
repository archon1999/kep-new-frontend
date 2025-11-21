import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../entities/hackathon.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface HackathonsRepository {
  list: (params?: ApiHackathonsListParams) => Promise<PageResult<Hackathon>>;
}
