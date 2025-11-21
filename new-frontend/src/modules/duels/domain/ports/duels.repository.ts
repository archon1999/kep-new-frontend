import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelsRatingRow } from '../entities';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface DuelListParams {
  username?: string;
  page?: number;
  pageSize?: number;
}

export interface ReadyPlayersParams {
  page?: number;
  pageSize?: number;
}

export interface DuelsRatingParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
}

export interface DuelsRepository {
  getReadyStatus(): Promise<DuelReadyStatus>;
  updateReadyStatus(ready: boolean): Promise<DuelReadyStatus>;
  listReadyPlayers(params?: ReadyPlayersParams): Promise<PageResult<DuelReadyPlayer>>;
  listDuels(params?: DuelListParams): Promise<PageResult<Duel>>;
  listMyDuels(params?: DuelListParams): Promise<PageResult<Duel>>;
  confirmDuel(duelId: number): Promise<void>;
  listDuelsRating(params?: DuelsRatingParams): Promise<PageResult<DuelsRatingRow>>;
  getDuel(duelId: number | string): Promise<Duel>;
}
