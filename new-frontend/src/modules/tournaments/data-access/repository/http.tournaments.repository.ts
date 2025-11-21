import { tournamentsApiClient } from '../api/tournaments.client';
import { mapTournament, mapTournamentsPage } from '../mappers/tournaments.mapper';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';
import { Tournament, TournamentListItem } from '../../domain/entities/tournament.entity';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: any): Promise<PageResult<TournamentListItem>> {
    const data = await tournamentsApiClient.list(params);
    return mapTournamentsPage(data);
  }

  async getTournament(id: number | string): Promise<Tournament> {
    const data = await tournamentsApiClient.getById(id);
    return mapTournament(data);
  }

  async register(id: number | string): Promise<void> {
    await tournamentsApiClient.register(id);
  }
}
