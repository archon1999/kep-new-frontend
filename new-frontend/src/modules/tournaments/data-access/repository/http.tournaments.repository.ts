import { tournamentsApiClient } from '../api/tournaments.client';
import { mapPageResult, mapTournament, mapTournamentSummary } from '../mappers/tournaments.mapper';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { Tournament, TournamentSummary } from '../../domain/entities/tournament.entity';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentSummary>> {
    const response = await tournamentsApiClient.list(params);
    return mapPageResult(response, mapTournamentSummary);
  }

  async getById(id: string | number): Promise<Tournament> {
    const response = await tournamentsApiClient.getById(id);
    return mapTournament(response as any);
  }

  async register(id: string | number): Promise<Tournament> {
    const response = await tournamentsApiClient.register(id);
    return mapTournament(response as any);
  }
}
