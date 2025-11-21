import { Tournament, TournamentListItem } from '../entities/tournament.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface TournamentsListFilters {
  page?: number;
  pageSize?: number;
  title?: string;
}

export interface TournamentsRepository {
  list: (filters?: TournamentsListFilters) => Promise<PageResult<TournamentListItem>>;
  getById: (id: number | string) => Promise<Tournament>;
  register: (id: number | string) => Promise<void>;
}
