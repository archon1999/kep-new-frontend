import duelsApiClient from '../api/duels.client.ts';
import {
  mapDuel,
  mapDuelResults,
  mapDuelsRatingRow,
  mapPageResult,
  mapReadyPlayer,
  mapReadyStatus,
} from '../mappers/duels.mapper.ts';
import {
  DuelCreatePayload,
  DuelListFilters,
  DuelReadyPlayersFilters,
  DuelsRepository,
  PageResult,
} from '../../domain/ports/duels.repository.ts';
import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelResults } from '../../domain/entities/duel.entity.ts';
import { DuelsRatingRow } from '../../domain/entities/duels-rating.entity.ts';

export class HttpDuelsRepository implements DuelsRepository {
  async getDuel(duelId: number | string): Promise<Duel> {
    const data = await duelsApiClient.getDuel(duelId);
    return mapDuel(data);
  }

  async getDuelResults(duelId: number | string): Promise<DuelResults> {
    const data = await duelsApiClient.getDuelResults(duelId);
    return mapDuelResults(data);
  }

  async listDuels(filters?: DuelListFilters): Promise<PageResult<Duel>> {
    const data = await duelsApiClient.listDuels(filters);
    return mapPageResult(data, mapDuel);
  }

  async listMyDuels(filters?: DuelListFilters): Promise<PageResult<Duel>> {
    const data = await duelsApiClient.listMyDuels(filters);
    return mapPageResult(data, mapDuel);
  }

  async confirmDuel(duelId: number): Promise<void> {
    await duelsApiClient.confirmDuel(duelId);
  }

  async listDuelsRating(filters?: DuelListFilters): Promise<PageResult<DuelsRatingRow>> {
    const data = await duelsApiClient.listDuelsRating(filters);
    return mapPageResult(data, mapDuelsRatingRow);
  }

  async getReadyStatus(): Promise<DuelReadyStatus> {
    const data = await duelsApiClient.getReadyStatus();
    return mapReadyStatus(data);
  }

  async updateReadyStatus(ready: boolean): Promise<DuelReadyStatus> {
    const data = await duelsApiClient.updateReadyStatus(ready);
    return mapReadyStatus(data);
  }

  async listReadyPlayers(filters?: DuelReadyPlayersFilters): Promise<PageResult<DuelReadyPlayer>> {
    const data = await duelsApiClient.listReadyPlayers(filters);
    return mapPageResult(data, mapReadyPlayer);
  }

  async createDuel(payload: DuelCreatePayload): Promise<void> {
    await duelsApiClient.createDuel(payload);
  }
}

export default HttpDuelsRepository;
