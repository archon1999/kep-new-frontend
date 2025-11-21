import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelResults } from '../entities/duel.entity.ts';
import { DuelsRatingRow } from '../entities/duels-rating.entity.ts';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface DuelListFilters {
  page?: number;
  pageSize?: number;
  username?: string;
  my?: boolean;
}

export interface DuelReadyPlayersFilters {
  page?: number;
  pageSize?: number;
  username?: string;
}

export interface DuelCreatePayload {
  duelUsername: string;
  duelPreset: number;
  startTime: string;
}

export interface DuelsRepository {
  getDuel: (duelId: number | string) => Promise<Duel>;
  getDuelResults: (duelId: number | string) => Promise<DuelResults>;
  listDuels: (filters?: DuelListFilters) => Promise<PageResult<Duel>>;
  listMyDuels: (filters?: DuelListFilters) => Promise<PageResult<Duel>>;
  confirmDuel: (duelId: number) => Promise<void>;
  listDuelsRating: (filters?: DuelListFilters) => Promise<PageResult<DuelsRatingRow>>;
  getReadyStatus: () => Promise<DuelReadyStatus>;
  updateReadyStatus: (ready: boolean) => Promise<DuelReadyStatus>;
  listReadyPlayers: (filters?: DuelReadyPlayersFilters) => Promise<PageResult<DuelReadyPlayer>>;
  createDuel: (payload: DuelCreatePayload) => Promise<void>;
}
