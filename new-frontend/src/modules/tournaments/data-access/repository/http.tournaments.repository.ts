import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentListItem } from '../../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { tournamentsApiClient } from '../api/tournaments.client';
import { mapPageResult, mapTournament, mapTournamentListItem } from '../mappers/tournament.mapper';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const result = await tournamentsApiClient.list(params);
    return mapPageResult(result, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<Tournament> {
    const result = await tournamentsApiClient.getById(String(id));
    return mapTournament(result as any);
  }

  async register(id: number | string): Promise<Tournament> {
    const result = await tournamentsApiClient.register(String(id));
    return mapTournament(result as any);
  }
}
