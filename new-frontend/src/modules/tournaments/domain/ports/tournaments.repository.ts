import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentListItem } from '../entities/tournament.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface TournamentsRepository {
  list: (params?: ApiTournamentsListParams) => Promise<PageResult<TournamentListItem>>;
  getTournament: (id: number | string) => Promise<Tournament>;
  register: (id: number | string) => Promise<void>;
}
