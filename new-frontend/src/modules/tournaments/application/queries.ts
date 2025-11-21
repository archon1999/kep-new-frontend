import useSWR from 'swr';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { Tournament, TournamentListItem } from '../domain/entities/tournament.entity';
import { PageResult } from '../domain/ports/tournaments.repository';

const tournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (params?: ApiTournamentsListParams) =>
  useSWR<PageResult<TournamentListItem>>(
    ['tournaments-list', params?.page, params?.pageSize],
    () => tournamentsRepository.list(params),
    { suspense: false },
  );

export const useTournament = (id?: string) =>
  useSWR<Tournament>(id ? ['tournament', id] : null, () => tournamentsRepository.getById(id!), { suspense: false });

export const tournamentsQueries = {
  tournamentsRepository,
};
