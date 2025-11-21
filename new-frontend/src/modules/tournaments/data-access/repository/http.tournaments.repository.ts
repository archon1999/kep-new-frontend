import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentListItem } from '../../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { tournamentsApiClient } from '../api/tournaments.client';
import { mapPageResult, mapTournamentDetail, mapTournamentListItem } from '../mappers/tournament.mapper';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const response = await tournamentsApiClient.list(params);
    return mapPageResult(response, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<Tournament> {
    const response = await tournamentsApiClient.getById(String(id));
    return mapTournamentDetail(response as any);
  }

  async register(id: number | string): Promise<Tournament> {
    const payload = await tournamentsApiClient.register(String(id), {} as any);
    return mapTournamentDetail(payload as any);
  }
}
