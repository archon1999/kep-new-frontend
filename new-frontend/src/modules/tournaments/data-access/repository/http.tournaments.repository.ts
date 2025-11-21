import { tournamentsApiClient } from '../api/tournaments.client.ts';
import { mapPageResult, mapTournament, mapTournamentListItem } from '../mappers/tournament.mapper.ts';
import {
  PageResult,
  Tournament,
  TournamentListItem,
  TournamentsListFilters,
  TournamentsRepository,
} from '../../domain/ports/tournaments.repository.ts';

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(filters?: TournamentsListFilters): Promise<PageResult<TournamentListItem>> {
    const data = await tournamentsApiClient.list(filters);
    return mapPageResult(data, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<Tournament> {
    const data = await tournamentsApiClient.getById(id);
    return mapTournament(data);
  }

  async register(id: number | string): Promise<void> {
    await tournamentsApiClient.register(id);
  }
}
