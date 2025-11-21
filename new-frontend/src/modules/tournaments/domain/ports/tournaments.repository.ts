import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentSummary } from '../entities/tournament.entity';

export interface PageResult<T> {
  data: T[];
  total: number;
  pagesCount: number;
}

export interface TournamentsRepository {
  list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentSummary>>;
  getById(id: string | number): Promise<Tournament>;
  register(id: string | number): Promise<Tournament>;
}
