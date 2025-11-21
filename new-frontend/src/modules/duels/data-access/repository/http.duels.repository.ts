import { duelsApiClient } from '../api/duels.client.ts';
import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelsRatingRow } from '../../domain';
import {
  DuelListParams,
  DuelsRatingParams,
  DuelsRepository,
  PageResult,
  ReadyPlayersParams,
} from '../../domain/ports/duels.repository.ts';

const mapPageResult = <T>(payload: any, mapper: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? 0,
  count: payload?.count ?? 0,
  total: payload?.total ?? 0,
  pagesCount: payload?.pagesCount ?? 0,
  data: (payload?.data ?? []).map(mapper),
});

const mapDuelPlayer = (player: any) => ({
  id: player?.id,
  username: player?.username,
  status: player?.status,
  ratingTitle: player?.ratingTitle ?? player?.rating_title,
  balls: player?.balls,
});

const mapDuel = (duel: any): Duel => ({
  id: duel?.id,
  startTime: duel?.startTime ?? duel?.start_time,
  finishTime: duel?.finishTime ?? duel?.finish_time,
  status: duel?.status,
  isPlayer: duel?.isPlayer ?? duel?.is_player,
  isConfirmed: duel?.isConfirmed ?? duel?.is_confirmed,
  playerFirst: mapDuelPlayer(duel?.playerFirst ?? duel?.player_first),
  playerSecond: duel?.playerSecond || duel?.player_second ? mapDuelPlayer(duel?.playerSecond ?? duel?.player_second) : null,
  preset: duel?.preset ?? duel?.duelPreset,
});

const mapReadyPlayer = (player: any): DuelReadyPlayer => ({
  username: player?.username,
  fullName: player?.fullName ?? player?.full_name,
  avatar: player?.avatar,
  wins: player?.wins,
  draws: player?.draws,
  losses: player?.losses,
});

const mapRatingRow = (row: any): DuelsRatingRow => ({
  rowIndex: row?.rowIndex ?? row?.row_index,
  user: {
    username: row?.user?.username,
    avatar: row?.user?.avatar,
  },
  duels: row?.duels,
  wins: row?.wins,
  draws: row?.draws,
  losses: row?.losses,
});

export class HttpDuelsRepository implements DuelsRepository {
  async getReadyStatus(): Promise<DuelReadyStatus> {
    const response = await duelsApiClient.getReadyStatus();
    return { ready: Boolean(response?.ready) };
  }

  async updateReadyStatus(ready: boolean): Promise<DuelReadyStatus> {
    const response = await duelsApiClient.updateReadyStatus(ready);
    return { ready: Boolean(response?.ready ?? ready) };
  }

  async listReadyPlayers(params?: ReadyPlayersParams): Promise<PageResult<DuelReadyPlayer>> {
    const response = await duelsApiClient.listReadyPlayers(params);
    return mapPageResult(response, mapReadyPlayer);
  }

  async listDuels(params?: DuelListParams): Promise<PageResult<Duel>> {
    const response = await duelsApiClient.listDuels(params);
    return mapPageResult(response, mapDuel);
  }

  async listMyDuels(params?: DuelListParams): Promise<PageResult<Duel>> {
    const response = await duelsApiClient.listMyDuels(params);
    return mapPageResult(response, mapDuel);
  }

  async confirmDuel(duelId: number): Promise<void> {
    await duelsApiClient.confirmDuel(duelId);
  }

  async listDuelsRating(params?: DuelsRatingParams): Promise<PageResult<DuelsRatingRow>> {
    const response = await duelsApiClient.listDuelsRating(params);
    return mapPageResult(response, mapRatingRow);
  }

  async getDuel(duelId: number | string): Promise<Duel> {
    const response = await duelsApiClient.getDuel(duelId);
    return mapDuel(response);
  }
}

export const duelsRepository = new HttpDuelsRepository();
