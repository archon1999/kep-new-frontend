import { tournamentsApiClient } from '../api/tournaments.client';
import { mapPageResult, mapTournament, mapTournamentDetail } from '../mappers/tournaments.mapper';
import { TournamentDetail, TournamentListItem } from '../../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const response = await tournamentsApiClient.list(params);
    return mapPageResult(response, mapTournament);
  }

  async getById(id: number | string): Promise<TournamentDetail> {
    const response = await tournamentsApiClient.getById(String(id));
    return mapTournamentDetail(response as any);
  }

  async register(id: number | string): Promise<void> {
    await tournamentsApiClient.register(String(id));
  }
}
