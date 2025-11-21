import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { TournamentDetail, TournamentListItem } from '../entities/tournament.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  pagesCount: number;
  total: number;
  count: number;
  data: T[];
}

export interface TournamentsRepository {
  list: (params?: ApiTournamentsListParams) => Promise<PageResult<TournamentListItem>>;
  getById: (id: number | string) => Promise<TournamentDetail>;
}
